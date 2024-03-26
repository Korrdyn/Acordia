import { APIChannel, Routes, Snowflake } from 'discord-api-types/v10';
import { BaseChannel } from './BaseChannel';
import { Guild } from './Guild';
import { PermissionOverwriteManager } from '../managers/PermissionOverwriteManager';
import { PermissionOverwrite } from '../utils/PermissionOverwrite';

export type APIGuildChannelType = Extract<APIChannel, { guild_id?: Snowflake }>;

export class GuildChannel extends BaseChannel {
  guild: Guild;
  permissionOverwrites!: PermissionOverwriteManager;
  position!: number;
  parentId!: string | null;
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

  deletePermission(overwrite: PermissionOverwrite | string, reason?: string) {
    return this.client.rest.delete(Routes.channelPermission(this.id, this.permissionOverwrites.resolveId(overwrite)), { reason });
  }
}
