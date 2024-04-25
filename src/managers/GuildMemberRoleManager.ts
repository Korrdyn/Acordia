import { GuildMember } from '../structures/GuildMember';
import { Role } from '../structures/Role';
import { Manager } from './Manager';

export class GuildMemberRoleManager extends Manager<Role> {
  member: GuildMember;

  constructor(member: GuildMember) {
    super(member.client);
    this.member = member;
  }
}
