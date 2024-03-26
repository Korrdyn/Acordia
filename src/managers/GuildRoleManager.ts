import { APIRole } from 'discord-api-types/v10';
import { Role } from '../structures/Role';
import { Manager } from './Manager';
import { Guild } from '../structures/Guild';

export class GuildRoleManager extends Manager<Role> {
  guild: Guild;

  constructor(guild: Guild) {
    super(guild.client);
    this.guild = guild;
  }

  add(data: APIRole) {
    let role = this.get(data.id);
    if (role) {
      role.patch(data);
    } else {
      role = new Role(this.guild, data);
      this.set(role.id, role);
    }
    return role;
  }
}
