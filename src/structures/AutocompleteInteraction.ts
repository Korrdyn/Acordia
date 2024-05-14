import { Client } from '@clients/Client';
import { Interaction } from '@structures/Interaction';
import {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteractionDataBasicOption,
  APIApplicationCommandInteractionDataIntegerOption,
  APIApplicationCommandInteractionDataNumberOption,
  APIApplicationCommandInteractionDataStringOption,
  APIApplicationCommandOptionChoice,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  InteractionResponseType,
} from 'discord-api-types/v10';

type AutocompleteOptions =
  | APIApplicationCommandInteractionDataStringOption
  | APIApplicationCommandInteractionDataIntegerOption
  | APIApplicationCommandInteractionDataNumberOption;

export class AutocompleteInteraction extends Interaction {
  data: APIApplicationCommandAutocompleteInteraction['data'];
  command: string;
  group: string | null = null;
  subcommand: string | null = null;
  options: APIApplicationCommandInteractionDataBasicOption[] = [];

  constructor(client: Client, data: APIApplicationCommandAutocompleteInteraction) {
    super(client, data);
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
  }

  /**
   * Acknowledge the interaction with choices
   *
   * @param {APIApplicationCommandOptionChoice[]} choices
   * @return {*}  {Promise<unknown>}
   * @memberof AutocompleteInteraction
   */
  acknowledge(choices: APIApplicationCommandOptionChoice[]): Promise<unknown> {
    return this.respond({ type: InteractionResponseType.ApplicationCommandAutocompleteResult, data: { choices } });
  }

  /**
   * Get the focused option
   *
   * @return {*}  {(AutocompleteOptions | null)}
   * @memberof AutocompleteInteraction
   */
  focused(): AutocompleteOptions | null {
    return (this.options.find((option) => (option as AutocompleteOptions).focused) as AutocompleteOptions) ?? null;
  }

  getOption<T>(arg: string, type: ApplicationCommandOptionType, required?: boolean): T | null {
    const value = this.options.find((option) => option.name === arg && option.type === type);
    if (value) return value.value as T;
    if (required) throw new TypeError(`Option ${arg} is null or undefined`);
    return null;
  }
}
