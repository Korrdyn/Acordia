import { Client } from '@clients/Client';
import { Manager } from '@managers/Manager';
import { PermissionOverwrite } from '@utils/PermissionOverwrite';
import { APIOverwrite, Routes } from 'discord-api-types/v10';

export class PermissionOverwriteManager extends Manager<PermissionOverwrite> {
  id: string;

  constructor(id: string, client: Client) {
    super(client);
    this.id = id;
  }

  /**
   * Add/update overwrite from payload
   *
   * @param {APIOverwrite} data
   * @return {*}  {PermissionOverwrite}
   * @memberof PermissionOverwriteManager
   * @internal
   */
  _add(data: APIOverwrite): PermissionOverwrite {
    const overwrite = new PermissionOverwrite(this.client, data);
    this.set(overwrite.id, overwrite);
    return overwrite;
  }

  /**
   * Get overwrite from overwrite or id
   *
   * @param {(PermissionOverwrite | string)} overwrite
   * @return {*}  {(PermissionOverwrite | null)}
   * @memberof PermissionOverwriteManager
   */
  resolve(overwrite: PermissionOverwrite | string): PermissionOverwrite | null {
    if (overwrite instanceof PermissionOverwrite) return overwrite;
    return this.get(overwrite) ?? null;
  }

  /**
   * Get id from overwrite or id
   *
   * @param {(PermissionOverwrite | string)} overwrite
   * @return {*}  {string}
   * @memberof PermissionOverwriteManager
   */
  resolveId(overwrite: PermissionOverwrite | string): string {
    if (overwrite instanceof PermissionOverwrite) return overwrite.id;
    return overwrite;
  }

  /**
   * Delete permission overwrite
   *
   * @param {(PermissionOverwrite | string)} overwrite - Permission overwrite object or user/role id
   * @param {string} [reason] - Reason for deleting the overwrite
   * @return {Promise<never>}
   * @memberof GuildChannel
   */
  remove(overwrite: PermissionOverwrite | string, reason?: string) {
    return this.client.rest.delete(Routes.channelPermission(this.id, this.resolveId(overwrite)), { reason }) as Promise<never>;
  }
}
