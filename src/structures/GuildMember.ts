import { APIGuildMember, GuildMemberFlags } from 'discord-api-types/v10';
import { Base } from './Base';
import { User } from './User';
import { Guild } from './Guild';

export class GuildMember extends Base {
  guild: Guild;
  user: User;
  nick!: string | null;
  avatar!: string | null;
  roles!: string[];
  joinedAt!: string;
  boosterSince!: string | null;
  deaf!: boolean;
  mute!: boolean;
  flags!: GuildMemberFlags;
  pending!: boolean;
  communicationDisabledUntil!: string | null;
  
  constructor(guild: Guild, data: APIGuildMember) {
    super(guild.client, data.user!.id);
    this.guild = guild;
    this.user = guild.client.users.add(data.user!);
  }

  override patch(data: APIGuildMember) {
    this.nick = data.nick ?? null;
    this.avatar = data.avatar ?? null;
    this.roles = data.roles;
    this.joinedAt = data.joined_at;
    this.boosterSince = data.premium_since ?? null;
    this.deaf = data.deaf;
    this.mute = data.mute;
    this.flags = data.flags;
    this.pending = data.pending ?? false;
    this.communicationDisabledUntil = data.communication_disabled_until ?? null;
  }
}
