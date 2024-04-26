import { Manager } from '@managers/Manager';
import { Guild } from '@structures/Guild';
import { GuildMember } from '@structures/GuildMember';
import { APIGuildMember } from 'discord-api-types/v10';

export class GuildMemberManager extends Manager<GuildMember> {
  guild: Guild;

  constructor(guild: Guild) {
    super(guild.client);
    this.guild = guild;
  }

  /**
   * Add/update member from payload
   *
   * @param {APIGuildMember} data
   * @return {*}  {GuildMember}
   * @memberof GuildMemberManager
   */
  _add(data: APIGuildMember): GuildMember {
    let member = this.get(data.user!.id);
    if (member) {
      member._patch(data);
    } else {
      member = new GuildMember(this.guild, data);
      this.set(member.id, member);
    }
    return member;
  }
}
