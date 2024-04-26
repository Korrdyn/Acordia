import { APIChannel, Snowflake } from 'discord-api-types/v10';
import { BaseChannel } from '@structures/BaseChannel';
import { Guild } from '@structures/Guild';
import { PermissionOverwriteManager } from '@managers/PermissionOverwriteManager';

export type APIGuildChannelType = Extract<APIChannel, { guild_id?: Snowflake }>;

export class GuildChannel extends BaseChannel {
  /**
   * Guild this channel is in
   *
   * @type {Guild}
   * @memberof GuildChannel
   */
  guild: Guild;

  /**
   * Permission overwrites
   *
   * @type {PermissionOverwriteManager}
   * @memberof GuildChannel
   */
  permissions!: PermissionOverwriteManager;

  /**
   * Position in sidebar
   *
   * @type {number}
   * @memberof GuildChannel
   */
  position!: number;

  /**
   * Id of category
   *
   * @type {(string | null)}
   * @memberof GuildChannel
   */
  parentId!: string | null;

  /**
   * Is channel marked as nsfw
   *
   * @type {boolean}
   * @memberof GuildChannel
   */
  nsfw!: boolean;

  constructor(guild: Guild, data: APIGuildChannelType) {
    super(guild.client, data);
    this.guild = guild;
    this.permissions = new PermissionOverwriteManager(this.id, this.client);
  }

  override _patch(data: APIGuildChannelType) {
    super._patch(data);
    if (data.permission_overwrites) {
      for (const overwrite of data.permission_overwrites) this.permissions._add(overwrite);
    }
    this.position = data.position;
    this.parentId = data.parent_id ?? null;
    this.nsfw = data.nsfw ?? false;
  }
}
