import { Client } from '@clients/Client';
import { RawFile } from '@discordjs/rest';
import { AutocompleteInteraction } from '@structures/AutocompleteInteraction';
import { Base } from '@structures/Base';
import { CommandInteraction } from '@structures/CommandInteraction';
import { ComponentInteraction } from '@structures/ComponentInteraction';
import { Guild } from '@structures/Guild';
import { APIGuildChannelType } from '@structures/GuildChannel';
import { GuildMember } from '@structures/GuildMember';
import { GuildTextChannel } from '@structures/GuildTextChannel';
import { ModalSubmitInteraction } from '@structures/ModalSubmitInteraction';
import { PingInteraction } from '@structures/PingInteraction';
import { User } from '@structures/User';
import { TextBasedChannel } from '@typings/ChannelTypes';
import { AcordiaError } from '@utils/AcordiaError';
import { PermissionBitfield } from '@utils/PermissionBitfield';
import {
  APIAllowedMentions,
  APIDMChannel,
  APIEmbed,
  APIEntitlement,
  APIInteraction,
  APIInteractionResponseCallbackData,
  APIMessage,
  APIModalInteractionResponseCallbackData,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
  RESTPatchAPIWebhookWithTokenMessageJSONBody,
  RESTPostAPIInteractionCallbackFormDataBody,
  RESTPostAPIInteractionFollowupJSONBody,
  Routes,
  Snowflake,
} from 'discord-api-types/v10';

export type GuildInteraction = Interaction & { guild: Guild; member: GuildMember };

export class Interaction extends Base {
  applicationId: Snowflake;
  token: string;
  type: InteractionType;
  version: number;
  acknowledged = false;
  entitlements: APIEntitlement[];
  guild: Guild | null;
  channel: TextBasedChannel | null = null;
  member: GuildMember | null = null;
  user: User | null = null;
  permissions: PermissionBitfield | null = null;

  constructor(client: Client, data: APIInteraction) {
    super(client, data.id);
    this.applicationId = data.application_id;
    this.token = data.token;
    this.type = data.type;
    this.version = data.version;
    this.entitlements = data.entitlements;
    this.guild = data.guild_id ? client.guilds.get(data.guild_id) ?? null : null;
    if (data.channel)
      this.channel = data.guild_id
        ? (this.guild?.channels._add(data.channel as APIGuildChannelType) as GuildTextChannel) ?? null
        : client.dmChannels._add(data.channel as APIDMChannel) ?? null;
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

  /**
   * @internal
   */
  update() {
    this.acknowledged = true;
  }

  inGuild(): this is GuildInteraction {
    return this.guild !== null;
  }

  isCommand(): this is CommandInteraction {
    return this.type === InteractionType.ApplicationCommand;
  }

  isAutocomplete(): this is AutocompleteInteraction {
    return this.type === InteractionType.ApplicationCommandAutocomplete;
  }

  isComponent(): this is ComponentInteraction {
    return this.type === InteractionType.MessageComponent;
  }

  isModal(): this is ModalSubmitInteraction {
    return this.type === InteractionType.ModalSubmit;
  }

  isPing(): this is PingInteraction {
    return this.type === InteractionType.Ping;
  }

  /**
   * Respond to the interaction with a message saying premium is required
   *
   * @return {*}  {Promise<never>}
   * @memberof Interaction
   */
  premiumRequired(): Promise<never> {
    return this.respond({ type: InteractionResponseType.PremiumRequired });
  }

  /**
   * Defer update of interaction.
   *
   * @param {boolean} [ephemeral=false] - Should the interaction be ephemeral
   * @return {*} {Promise<unknown>}
   * @memberof Interaction
   */
  deferUpdate(ephemeral: boolean = false): Promise<unknown> {
    return this.respond({
      type: InteractionResponseType.DeferredChannelMessageWithSource,
      data: ephemeral
        ? {
            flags: MessageFlags.Ephemeral,
          }
        : undefined,
    });
  }

  /**
   * Send a follow up message for an interaction
   *
   * @param {APIInteractionResponseCallbackData} body
   * @param {RawFile[]} [files]
   * @return {*}  {Promise<unknown>}
   * @memberof Interaction
   */
  followup(body: RESTPostAPIInteractionFollowupJSONBody, files?: RawFile[]): Promise<unknown> {
    return this.client.rest.post(Routes.webhook(this.applicationId, this.token), { body, files });
  }

  /**
   * Reply to the interaction with a message.
   *
   * If interaction already acknowledged will respond as a follow up
   *
   * @param {APIInteractionResponseCallbackData} body
   * @param {RawFile[]} [files]
   * @return {*}  {Promise<unknown>}
   * @memberof Interaction
   */
  reply(body: APIInteractionResponseCallbackData, files?: RawFile[]): Promise<unknown> {
    if (this.acknowledged) return this.followup(body, files);
    return this.respond({ type: InteractionResponseType.ChannelMessageWithSource, data: body }, files);
  }

  /**
   * Respond to interaction with a message
   *
   * @param {string} content
   * @param {RawFile[]} [files]
   * @param {{ allowedMentions?: APIAllowedMentions; ephemeral?: boolean }} [options]
   * @return {*}  {Promise<unknown>}
   * @memberof Interaction
   */
  sendMessage(content: string, files?: RawFile[], options?: { allowedMentions?: APIAllowedMentions; ephemeral?: boolean }): Promise<unknown> {
    const data: APIInteractionResponseCallbackData = { content, allowed_mentions: options?.allowedMentions };
    if (options?.ephemeral) data.flags = MessageFlags.Ephemeral;
    return this.reply(data, files);
  }

  /**
   * Respond to interaction with an embed
   *
   * @param {APIEmbed} embed
   * @param {RawFile[]} [files]
   * @param {{ ephemeral?: boolean }} [options]
   * @return {*}  {Promise<unknown>}
   * @memberof Interaction
   */
  sendEmbed(embed: APIEmbed, files?: RawFile[], options?: { ephemeral?: boolean }): Promise<unknown>;

  /**
   * Respond to interaction with embeds
   *
   * @param {APIEmbed[]} embeds
   * @param {RawFile[]} [files]
   * @param {{ ephemeral?: boolean }} [options]
   * @return {*}  {Promise<unknown>}
   * @memberof Interaction
   */
  sendEmbed(embeds: APIEmbed[], files?: RawFile[], options?: { ephemeral?: boolean }): Promise<unknown>;
  sendEmbed(embedOrEmbeds: APIEmbed | APIEmbed[], files?: RawFile[], options?: { ephemeral?: boolean }): Promise<unknown> {
    const data: APIInteractionResponseCallbackData = { embeds: Array.isArray(embedOrEmbeds) ? embedOrEmbeds : [embedOrEmbeds] };
    if (options?.ephemeral) data.flags = MessageFlags.Ephemeral;
    return this.reply(data, files);
  }

  /**
   * Show a modal to the user
   *
   * @param {APIModalInteractionResponseCallbackData} data
   * @return {*}  {Promise<unknown>}
   * @memberof Interaction
   */
  showModal(data: APIModalInteractionResponseCallbackData): Promise<unknown> {
    return this.respond({ type: InteractionResponseType.Modal, data });
  }

  /**
   * Delete a response
   *
   * @param {Snowflake} [messageId='@original']
   * @return {*}  {Promise<unknown>}
   * @memberof Interaction
   */
  deleteResponse(messageId: Snowflake = '@original'): Promise<unknown> {
    return this.client.rest.delete(Routes.webhookMessage(this.applicationId, this.token, messageId));
  }

  /**
   * Edit a response
   *
   * @param {Snowflake} messageId
   * @param {RESTPatchAPIWebhookWithTokenMessageJSONBody} content
   * @param {RawFile[]} [files]
   * @return {*}  {Promise<unknown>}
   * @memberof Interaction
   */
  editResponse(messageId: Snowflake, content: RESTPatchAPIWebhookWithTokenMessageJSONBody, files?: RawFile[]): Promise<unknown> {
    if (!this.acknowledged) throw new AcordiaError("Interaction hasn't been acknowledged yet");
    return this.client.rest.patch(Routes.webhookMessage(this.applicationId, this.token, messageId), { body: content, files });
  }

  /**
   * Edit the original response
   *
   * @param {RESTPatchAPIWebhookWithTokenMessageJSONBody} content
   * @param {RawFile[]} [files]
   * @return {*}  {Promise<unknown>}
   * @memberof Interaction
   */
  editOriginalResponse(content: RESTPatchAPIWebhookWithTokenMessageJSONBody, files?: RawFile[]): Promise<unknown> {
    return this.editResponse('@original', content, files);
  }

  /**
   * Get the original response
   *
   * @return {*}  {Promise<APIMessage>}
   * @memberof Interaction
   */
  async getOriginalResponse(): Promise<APIMessage> {
    if (!this.acknowledged) throw new AcordiaError("Interaction hasn't been acknowledged yet");
    const response = (await this.client.rest.get(Routes.webhookMessage(this.applicationId, this.token, '@original'))) as APIMessage;
    // TODO: Use Message class
    return response;
  }

  /**
   * @internal
   */
  async respond<T = unknown>(content: RESTPostAPIInteractionCallbackFormDataBody, files?: RawFile[]): Promise<T> {
    if (this.acknowledged) throw new AcordiaError('This interaction has already been acknowledged');
    const response = await this.client.rest.post(Routes.interactionCallback(this.id, this.token), { body: content, files });
    this.update();
    return response as T;
  }
}
