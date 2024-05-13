import { Collection } from "@discordjs/collection";
import { Guild } from "@structures/Guild";
import { GuildThreadMember } from "@structures/GuildThreadMember";
import { APIThreadMember } from "discord-api-types/v10";

export class GuildThreadMemberManager extends Collection<string, GuildThreadMember> {
  guild: Guild;

  constructor(guild: Guild) {
    super();
    this.guild = guild;
   }

  _add(data: APIThreadMember): GuildThreadMember {
    let member = this.get(data.user_id!);
    if (member) {
      member._patch(data);
    } else {
      member = new GuildThreadMember(this.guild, data);
      this.set(member.userId, member);
    }
    return member;
  }
}
