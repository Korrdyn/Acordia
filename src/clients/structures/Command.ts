import { AutocompleteInteraction } from '@structures/AutocompleteInteraction';
import { CommandInteraction } from '@structures/CommandInteraction';
import { ComponentInteraction } from '@structures/ComponentInteraction';
import { ModalSubmitInteraction } from '@structures/ModalSubmitInteraction';
import { RESTPostAPIChatInputApplicationCommandsJSONBody, RESTPostAPIApplicationGuildCommandsJSONBody } from 'discord-api-types/v10';

interface Command<Context, MiddlewareData = any> {
  handleCommand(context: Context, interaction: CommandInteraction, fetchedData?: MiddlewareData): Promise<any> | any;
  handleModal(context: Context, interaction: ModalSubmitInteraction, fetchedData?: MiddlewareData): Promise<any> | any;
  handleAutocomplete(context: Context, interaction: AutocompleteInteraction, fetchedData?: MiddlewareData): Promise<any> | any;
  handleComponent(context: Context, interaction: ComponentInteraction, fetchedData?: MiddlewareData): Promise<any> | any;
}

class Command<Context, MiddlewareData = any> {
  id!: string;

  /**
   * Definition for the command
   *
   * @type {(RESTPostAPIChatInputApplicationCommandsJSONBody | RESTPostAPIApplicationGuildCommandsJSONBody)}
   * @memberof Command
   */
  definition?: RESTPostAPIChatInputApplicationCommandsJSONBody | RESTPostAPIApplicationGuildCommandsJSONBody;

  /**
   * If populated this command will only be deployed to the guilds listed in this array
   *
   * @type {string[]}
   * @memberof Command
   */
  guilds?: string[];

  /**
   * Should this command only be ran by developers
   *
   * @type {boolean}
   * @memberof Command
   */
  developerOnly?: boolean;

  /**
   * Array of permissions the user has to have to run the command
   *
   * @type {bigint[]}
   * @memberof Command
   */
  userPermissions?: bigint[];

  /**
   * Array of users allowed to run this command
   *
   * @type {string[]}
   * @memberof Command
   */
  users?: string[];

  /**
   * Cooldown 🥶 (seconds)
   *
   * @type {number}
   * @memberof Command
   */
  cooldown?: number;

  /**
   * Should the client run the middleware function for this command
   *
   * @memberof Command
   */
  middleware = { command: true, modal: true, component: true, autocomplete: false };

  get command() {
    return this.id;
  }
}

export default Command;
