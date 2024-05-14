import { Client } from '@clients/Client';
import { CooldownHandler, CooldownLogic } from '@clients/CooldownHandler';
import Command from '@clients/structures/Command';
import { CommandError } from '@clients/structures/CommandError';
import Event from '@clients/structures/Event';
import { Collection } from '@discordjs/collection';
import { Interaction } from '@structures/Interaction';
import { ICommandClientOptions } from '@typings/ClientOptions';
import { Events } from '@typings/events/ClientEvents';
import { AcordiaError } from '@utils/AcordiaError';
import {
  APIApplicationCommand,
  RESTPostAPIApplicationCommandsJSONBody,
  RESTPostAPIApplicationGuildCommandsJSONBody,
  PermissionFlagsBits,
  Routes,
} from 'discord-api-types/v10';

export class CommandClient<Context = any, MiddlewareData = any> extends Client {
  commands = new Collection<string, Command<Context>>();
  events = new Map<string, Collection<string, Event<Context>>>();
  cooldown: CooldownLogic;
  private context?: Context;
  private readonly middleware?: (interaction: Interaction) => Promise<MiddlewareData> | MiddlewareData;

  constructor(options: ICommandClientOptions) {
    super(options);
    this.cooldown = options.cooldown ?? new CooldownHandler();
    this.context = options.context;
    if (options.middleware) this.middleware = options.middleware;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.on('interactionCreate', this.handleInteraction.bind(this));
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.on('event', this.handleEvent.bind(this));
  }

  registerCommand(command: Command<Context>) {
    this.commands.set(command.id, command);
  }

  registerEvent(event: Event<Context>) {
    let events = this.events.get(event.event);
    if (!events) {
      this.events.set(event.event, new Collection<string, Event<Context>>());
      events = this.events.get(event.event);
    }
    events?.set(event.id, event);
  }

  async deployCommands(commandNames?: string[]) {
    if (!this.commands.size) throw new Error('No commands registered in client');
    if (!this.isProduction && !this.devGuild) throw new Error('Unable to register commands, NODE_ENV not production and DEV_GUILD not set');

    const availableCommands = this.commands.filter((command) => (commandNames?.includes(command.command) ?? true) && command.definition !== undefined);
    let deployedCommands: APIApplicationCommand[] = [];

    if (this.isProduction) {
      const publicCommands = availableCommands.filter((command) => !command.guilds?.length);
      if (publicCommands.size)
        deployedCommands = (await this.rest.put(Routes.applicationCommands(this.application.id), {
          body: publicCommands.map((command) => command.definition) as RESTPostAPIApplicationCommandsJSONBody[],
        })) as APIApplicationCommand[];
      const privateCommands = availableCommands.filter((command) => (command.guilds ? command.guilds.length > 1 : false));
      const guildCommands: Record<string, RESTPostAPIApplicationGuildCommandsJSONBody[]> = {};
      for (const [, command] of privateCommands.entries()) {
        for (const guild of command.guilds!) {
          if (!guildCommands[guild]) guildCommands[guild] = [];
          guildCommands[guild]!.push(command.definition as RESTPostAPIApplicationGuildCommandsJSONBody);
        }
      }
      for (const guild in guildCommands) {
        deployedCommands.push(
          ...((await this.rest.put(Routes.applicationGuildCommands(this.application.id, guild), { body: guildCommands[guild] })) as APIApplicationCommand[]),
        );
      }
    } else if (this.devGuild) {
      deployedCommands.push(
        ...((await this.rest.put(Routes.applicationGuildCommands(this.application.id, this.devGuild), {
          body: availableCommands.map((command) => command.definition),
        })) as APIApplicationCommand[]),
      );
    }

    return deployedCommands;
  }

  private async handleInteraction(interaction: Interaction): Promise<any> {
    try {
      if (interaction.isCommand()) {
        const command = this.commands.find((c) => c.command === interaction.command);
        if (!command?.handleCommand) return;

        if (command.developerOnly && interaction.guild?.id !== this.devGuild) {
          this.emit('commandError', command.command, interaction, { type: CommandError.NotDeveloperGuild, data: interaction.guild?.id });
          return;
        }

        const userID = interaction.member?.id ?? interaction.user?.id;
        if (!userID) throw new AcordiaError('Unable to get user id from interaction. Maybe missing essential intents?');

        if (command.cooldown) {
          const cooldown = await this.cooldown.getCooldown(userID, command.command);
          if (cooldown.onCooldown) {
            this.emit('commandError', command.command, interaction, {
              type: CommandError.OnCooldown,
              data: {
                userID,
                cooldown,
              },
            });
            return;
          }
        }

        if (command.users && !command.users.includes(userID)) {
          this.emit('commandError', command.command, interaction, { type: CommandError.DeniedUser, data: userID });
          return;
        }

        if (interaction.inGuild()) {
          if (command.guilds && !command.guilds.includes(interaction.guild?.id as string)) {
            this.emit('commandError', command.command, interaction, { type: CommandError.DeniedGuild, data: interaction.guild.id });
            return;
          }

          if (command.userPermissions) {
            const missing: string[] = [];
            for (const permission of command.userPermissions) {
              if (!interaction.member?.permissions.has(permission)) {
                missing.push(Object.keys(PermissionFlagsBits).find((key) => PermissionFlagsBits[key as keyof typeof PermissionFlagsBits] === permission)!);
              }
            }
            if (missing.length) {
              this.emit('commandError', command.command, interaction, { type: CommandError.MissingPermission, data: { userID, permissions: missing } });
              return;
            }
          }
        }

        let extraData: MiddlewareData;
        try {
          extraData = this.middleware && command.middleware.command ? await this.middleware(interaction) : (undefined as MiddlewareData);
        } catch (error) {
          return this.emit('commandError', command.command, interaction, { type: CommandError.MiddlewareError, data: error });
        }

        try {
          await command.handleCommand(this.context ?? (this as unknown as Context), interaction, extraData);
          this.emit('commandExecuted', command.command, interaction);
        } catch (error) {
          this.emit('commandError', command.command, interaction, { type: CommandError.UncaughtError, data: error as Error, interaction: 'command' });
        }
        if (command.cooldown) await this.cooldown.setCooldown(userID, command.command, command.cooldown * 1000 + Date.now());
      } else if (interaction.isAutocomplete()) {
        const command = this.commands.find((c) => c.command === interaction.data.name);
        if (!command?.handleAutocomplete) return;

        let extraData: MiddlewareData;
        try {
          extraData = this.middleware && command.middleware.autocomplete ? await this.middleware(interaction) : (undefined as MiddlewareData);
        } catch (error) {
          return this.emit('commandError', command.command, interaction, { type: CommandError.MiddlewareError, data: error });
        }

        try {
          await command.handleAutocomplete(this.context ?? (this as unknown as Context), interaction, extraData);
          this.emit('commandExecuted', command.command, interaction);
        } catch (error) {
          this.emit('commandError', command.command, interaction, { type: CommandError.UncaughtError, data: error as Error, interaction: 'autocomplete' });
        }
      } else if (interaction.isModal()) {
        const command = this.commands.find((c) => interaction.data.custom_id.startsWith(`${c.command}:`));
        if (!command?.handleModal) return;

        let extraData: MiddlewareData;
        try {
          extraData = this.middleware && command.middleware.modal ? await this.middleware(interaction) : (undefined as MiddlewareData);
        } catch (error) {
          return this.emit('commandError', command.command, interaction, { type: CommandError.MiddlewareError, data: error });
        }

        try {
          await command.handleModal(this.context ?? (this as unknown as Context), interaction, extraData);
          this.emit('commandExecuted', command.command, interaction);
        } catch (error) {
          this.emit('commandError', command.command, interaction, { type: CommandError.UncaughtError, data: error as Error, interaction: 'modal' });
        }
      } else if (interaction.isComponent()) {
        const command = this.commands.find((c) => interaction.data.custom_id.startsWith(`${c.command}:`));
        if (!command?.handleComponent) return;

        let extraData: MiddlewareData;
        try {
          extraData = this.middleware && command.middleware.component ? await this.middleware(interaction) : (undefined as MiddlewareData);
        } catch (error) {
          return this.emit('commandError', command.command, interaction, { type: CommandError.MiddlewareError, data: error });
        }

        try {
          await command.handleComponent(this.context ?? (this as unknown as Context), interaction, extraData);
          this.emit('commandExecuted', command.command, interaction);
        } catch (error) {
          this.emit('commandError', command.command, interaction, { type: CommandError.UncaughtError, data: error as Error, interaction: 'component' });
        }
      }
    } catch (error) {
      this.emit('error', error as Error);
    }
  }

  private async handleEvent(eventName: `${Events}`, ...args: any[]) {
    const events = this.events.get(eventName);
    if (!events) return;
    for (const [, event] of events) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        await event.handle(this.context ?? (this as unknown as Context), ...args);
      } catch (error) {
        this.emit('error', error as Error);
      }
    }
  }

  /**
   * Set the context for the client to pass to bot code on interaction or events
   *
   * @param {Context} context
   * @memberof CommandClient
   */
  setContext(context: Context) {
    this.context = context;
  }

  /**
   * returns true if NODE_ENV is 'production'
   *
   * @readonly
   * @memberof CommandClient
   */
  get isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  /**
   * returns the dev guild id if DEV_GUILD is set
   *
   * @readonly
   * @memberof CommandClient
   */
  get devGuild() {
    return process.env.DEV_GUILD ?? null;
  }
}
