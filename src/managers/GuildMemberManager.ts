import { APIGuildMember } from 'discord-api-types/v10';
import { GuildMember } from '../structures/GuildMember';
import { Manager } from './Manager';
import { Guild } from '../structures/Guild';

export class GuildMemberManager extends Manager<GuildMember> {
  guild: Guild;

  constructor(guild: Guild) {
    super(guild.client);
    this.guild = guild;
  }

  add(data: APIGuildMember) {
    let member = this.get(data.user!.id);
    if (member) {
      member.patch(data);
    } else {
      member = new GuildMember(this.guild, data);
      this.set(member.id, member);
    }
    return member;
  }
}
