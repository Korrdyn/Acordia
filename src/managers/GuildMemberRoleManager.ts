import { Manager } from "@managers/Manager";
import { GuildMember } from "@structures/GuildMember";
import { Role } from "@structures/Role";

export class GuildMemberRoleManager extends Manager<Role> {
  member: GuildMember;

  constructor(member: GuildMember) {
    super(member.client);
    this.member = member;
  }
}
