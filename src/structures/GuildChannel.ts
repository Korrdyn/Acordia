import { APIChannel, Routes, Snowflake } from 'discord-api-types/v10';
import { BaseChannel } from '@structures/BaseChannel';
import { Guild } from '@structures/Guild';
import { PermissionOverwriteManager } from '@managers/PermissionOverwriteManager';
import { PermissionOverwrite } from '@utils/PermissionOverwrite';

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
  permissionOverwrites!: PermissionOverwriteManager;

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
    this.permissionOverwrites = new PermissionOverwriteManager();
  }

  override patch(data: APIGuildChannelType) {
    super.patch(data);
    if (data.permission_overwrites) {
      for (const overwrite of data.permission_overwrites) this.permissionOverwrites.add(overwrite);
    }
    this.position = data.position;
    this.parentId = data.parent_id ?? null;
    this.nsfw = data.nsfw ?? false;
  }

  /**
   * Delete permission overwrite
   *
   * @param {(PermissionOverwrite | string)} overwrite - Permission overwrite object or user/role id
   * @param {string} [reason] - Reason for deleting the overwrite
   * @return {Promise<never>}
   * @memberof GuildChannel
   */
  deletePermission(overwrite: PermissionOverwrite | string, reason?: string) {
    return this.client.rest.delete(Routes.channelPermission(this.id, this.permissionOverwrites.resolveId(overwrite)), { reason }) as Promise<never>;
  }
}
