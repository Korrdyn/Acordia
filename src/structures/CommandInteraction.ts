import { Client } from '@clients/Client';
import { Collection } from '@discordjs/collection';
import { APIGuildChannelType } from '@structures/GuildChannel';
import { GuildMember } from '@structures/GuildMember';
import { GuildTextChannel } from '@structures/GuildTextChannel';
import { Interaction } from '@structures/Interaction';
import { User } from '@structures/User';
import { TextBasedChannel } from '@typings/ChannelTypes';
import { Role } from './Role';
import { BaseChannel } from './BaseChannel';
import { Message } from './Message';
import {
  APIApplicationCommandGuildInteraction,
  APIApplicationCommandInteraction,
  APIApplicationCommandInteractionDataBasicOption,
  APIAttachment,
  APIChatInputApplicationCommandInteraction,
  APIDMChannel,
  APIGuildMember,
  APIInteractionDataResolved,
  APIMessage,
  APIMessageApplicationCommandInteraction,
  APIUserApplicationCommandInteraction,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChannelType,
} from 'discord-api-types/v10';
import { PermissionBitfield } from '@utils/PermissionBitfield';

export class CommandInteraction<T extends APIApplicationCommandInteraction = APIApplicationCommandInteraction> extends Interaction {
  channel: TextBasedChannel;
  member: GuildMember | null = null;
  user!: User;
  data: T['data'];
  command: string;
  group: string | null = null;
  subcommand: string | null = null;
  options: APIApplicationCommandInteractionDataBasicOption[] = [];
  users = new Collection<string, User>();
  members = new Collection<string, GuildMember>();
  roles = new Collection<string, Role>();
  channels = new Collection<string, BaseChannel>();
  messages = new Collection<string, Message>();
  permissions: PermissionBitfield | null = null;

  constructor(client: Client, data: APIApplicationCommandGuildInteraction | APIApplicationCommandInteraction) {
    super(client, data);

    if (this.guild) {
      this.channel = this.guild.channels._add(data.channel as APIGuildChannelType) as GuildTextChannel;
    } else {
      this.channel = client.dmChannels._add(data.channel as APIDMChannel);
    }

    this.data = JSON.parse(JSON.stringify(data.data));
    this.command = this.data.name;

    if (this.data.type === ApplicationCommandType.ChatInput) {
      if (this.data.options?.[0]?.type === ApplicationCommandOptionType.SubcommandGroup) {
        this.group = this.data.options[0].name;
        if (this.data.options[0].options[0]?.type === ApplicationCommandOptionType.Subcommand) {
          this.subcommand = this.data.options[0].options[0]?.name;
          this.options = this.data.options[0].options[0]?.options ?? [];
        }
      } else if (this.data.options?.[0]?.type === ApplicationCommandOptionType.Subcommand) {
        this.subcommand = this.data.options[0].name;
        this.options = this.data.options[0].options ?? [];
      } else this.options = (this.data.options as APIApplicationCommandInteractionDataBasicOption[]) ?? [];
    }

    if (data.data.resolved !== undefined) {
      if ('users' in data.data.resolved && data.data.resolved.users !== undefined) {
        Object.entries(data.data.resolved.users).forEach(([id, user]) => {
          this.users.set(id, this.client.users._add(user));
        });
      }

      if ('members' in data.data.resolved && data.data.resolved.members !== undefined && this.guild) {
        Object.entries(data.data.resolved.members).forEach(([id, member]) => {
          // @ts-expect-error -- need id
          member.user = { id };

          this.members.set(id, this.guild!.members._add(member as unknown as APIGuildMember));
        });
      }

      if ('roles' in data.data.resolved && data.data.resolved.roles !== undefined && this.guild) {
        Object.entries(data.data.resolved.roles).forEach(([id, role]) => {
          this.roles.set(id, this.guild!.roles._add(role));
        });
      }

      if ('channels' in data.data.resolved && data.data.resolved.channels !== undefined) {
        Object.entries(data.data.resolved.channels).forEach(([id, data]) => {
          if (this.guild) {
            this.channels.set(id, this.guild!.channels._add(data as unknown as APIGuildChannelType));
          } else if (data.type === ChannelType.DM) {
            this.channels.set(id, this.client.dmChannels._add(data as unknown as APIDMChannel));
          }
        });
      }

      if ('messages' in data.data.resolved && data.data.resolved.messages !== undefined) {
        Object.entries(data.data.resolved.messages).forEach(([id, message]) => {
          const channel = this.guild ? this.guild.channels.get(message.channel_id) : this.client.dmChannels.get(message.channel_id);
          this.messages.set(id, new Message(channel as unknown as TextBasedChannel, data as unknown as APIMessage));
        });
      }
    }

    if (data.member !== undefined) {
      if (this.guild) {
        this.member = this.guild.members._add(data.member);
        this.user = this.client.users._add(data.member.user);
      }
    }

    if ('user' in data && data.user !== undefined) {
      this.user = this.client.users._add(data.user);
    }

    if (data.app_permissions !== undefined) {
      this.permissions = new PermissionBitfield(data.app_permissions);
    }
  }

  isSlashCommand(): this is CommandInteraction<APIChatInputApplicationCommandInteraction> {
    return this.data.type === ApplicationCommandType.ChatInput;
  }

  isUserContext(): this is CommandInteraction<APIUserApplicationCommandInteraction> {
    return this.data.type === ApplicationCommandType.User;
  }

  isMessageContext(): this is CommandInteraction<APIMessageApplicationCommandInteraction> {
    return this.data.type === ApplicationCommandType.Message;
  }

  getString(arg: string): string | null {
    return this.getOption<string>(arg, ApplicationCommandOptionType.String, false);
  }

  getRequiredString(arg: string): string {
    return this.getOption<string>(arg, ApplicationCommandOptionType.String, true)!;
  }

  getInteger(arg: string): number | null {
    return this.getOption<number>(arg, ApplicationCommandOptionType.Integer, false);
  }

  getRequiredInteger(arg: string): number {
    return this.getOption<number>(arg, ApplicationCommandOptionType.Integer, true)!;
  }

  getNumber(arg: string): number | null {
    return this.getOption<number>(arg, ApplicationCommandOptionType.Number, false);
  }

  getRequiredNumber(arg: string): number {
    return this.getOption<number>(arg, ApplicationCommandOptionType.Number, true)!;
  }

  getBoolean(arg: string): boolean | null {
    return this.getOption<boolean>(arg, ApplicationCommandOptionType.Boolean, false);
  }

  getRequiredBoolean(arg: string): boolean {
    return this.getOption<boolean>(arg, ApplicationCommandOptionType.Boolean, true)!;
  }

  // TODO: Create attachment class
  getAttachment(arg: string): APIAttachment | null {
    const ID = this.getOption<string>(arg, ApplicationCommandOptionType.Attachment, false);
    if (!ID) return null;
    return (this.data.resolved as APIInteractionDataResolved).attachments?.[ID] ?? null;
  }

  getRequiredAttachment(arg: string): APIAttachment {
    const ID = this.getOption<string>(arg, ApplicationCommandOptionType.Attachment, false);
    if (!ID) throw new TypeError(`Option ${arg} is null or undefined`);
    const attachment = (this.data.resolved as APIInteractionDataResolved).attachments?.[ID];
    if (!attachment) throw new TypeError(`Option ${arg} is null or undefined`);
    return attachment;
  }

  getChannel(arg: string): BaseChannel | null {
    const value = this.getOption<string>(arg, ApplicationCommandOptionType.Channel, false);
    if (!value) return null;
    return this.channels.get(value) ?? null;
  }

  getRequiredChannel(arg: string): BaseChannel {
    const value = this.getOption<string>(arg, ApplicationCommandOptionType.Channel, true);
    if (!value) throw new TypeError(`Option ${arg} is null or undefined`);
    const object = this.channels.get(value);
    if (!object) throw new TypeError(`Option ${arg} is null or undefined`);
    return object;
  }

  getRole(arg: string): Role | null {
    const value = this.getOption<string>(arg, ApplicationCommandOptionType.Role, false);
    if (!value) return null;
    return this.roles.get(value) ?? null;
  }

  getRequiredRole(arg: string): Role {
    const value = this.getOption<string>(arg, ApplicationCommandOptionType.Role, true);
    if (!value) throw new TypeError(`Option ${arg} is null or undefined`);
    const object = this.roles.get(value);
    if (!object) throw new TypeError(`Option ${arg} is null or undefined`);
    return object;
  }

  getUser(arg: string): User | null {
    const value = this.getOption<string>(arg, ApplicationCommandOptionType.User, false);
    if (!value) return null;
    return this.users.get(value) ?? null;
  }

  getRequiredUser(arg: string): User {
    const value = this.getOption<string>(arg, ApplicationCommandOptionType.User, true);
    if (!value) throw new TypeError(`Option ${arg} is null or undefined`);
    const object = this.users.get(value);
    if (!object) throw new TypeError(`Option ${arg} is null or undefined`);
    return object;
  }

  getMember(arg: string): GuildMember | null {
    const value = this.getOption<string>(arg, ApplicationCommandOptionType.User, false);
    if (!value) return null;
    return this.members.get(value) ?? null;
  }

  getRequiredMember(arg: string): GuildMember {
    const value = this.getOption<string>(arg, ApplicationCommandOptionType.User, true);
    if (!value) throw new TypeError(`Option ${arg} is null or undefined`);
    const object = this.members.get(value);
    if (!object) throw new TypeError(`Option ${arg} is null or undefined`);
    return object;
  }

  getMentionable(arg: string): GuildMember | User | null {
    const value = this.getOption<string>(arg, ApplicationCommandOptionType.Mentionable, false);
    if (!value) return null;
    return this.members.get(value) ?? this.users.get(value) ?? null;
  }

  getRequiredMentionable(arg: string): GuildMember | User {
    const value = this.getOption<string>(arg, ApplicationCommandOptionType.Mentionable, true);
    if (!value) throw new TypeError(`Option ${arg} is null or undefined`);
    const object = this.members.get(value) ?? this.users.get(value);
    if (!object) throw new TypeError(`Option ${arg} is null or undefined`);
    return object;
  }

  private getOption<T>(arg: string, type: ApplicationCommandOptionType, required?: boolean): T | null {
    const value = this.options.find((option) => option.name === arg && option.type === type);
    if (value) return value.value as T;
    if (required) throw new TypeError(`Option ${arg} is null or undefined`);
    return null;
  }
}
