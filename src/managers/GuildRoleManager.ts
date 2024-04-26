import { Manager } from '@managers/Manager';
import { Guild } from '@structures/Guild';
import { Role } from '@structures/Role';
import { APIRole } from 'discord-api-types/v10';

export class GuildRoleManager extends Manager<Role> {
  guild: Guild;

  constructor(guild: Guild) {
    super(guild.client);
    this.guild = guild;
  }

  /**
   * Add/update role from payload
   *
   * @param {APIRole} data
   * @return {*}  {Role}
   * @memberof GuildRoleManager
   * @internal
   */
  _add(data: APIRole): Role {
    let role = this.get(data.id);
    if (role) {
      role._patch(data);
    } else {
      role = new Role(this.guild, data);
      this.set(role.id, role);
    }
    return role;
  }
}
