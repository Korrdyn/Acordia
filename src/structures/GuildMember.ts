import { APIGuildMember, GuildMemberFlags } from 'discord-api-types/v10';
import { Base } from '@structures/Base';
import { User } from '@structures/User';
import { Guild } from '@structures/Guild';
import { GuildMemberRoleManager } from '@managers/GuildMemberRoleManager';

export class GuildMember extends Base {
  /**
   * Guild member belongs to
   *
   * @type {Guild}
   * @memberof GuildMember
   */
  guild: Guild;

  /**
   * Members user
   *
   * @type {User}
   * @memberof GuildMember
   */
  user: User;

  /**
   * Nickname in guild
   *
   * @type {(string | null)}
   * @memberof GuildMember
   */
  nick!: string | null;

  /**
   * Avatar hash
   *
   * @type {(string | null)}
   * @memberof GuildMember
   */
  avatar!: string | null;

  /**
   * Timestamp for when member joined
   *
   * @type {string}
   * @memberof GuildMember
   */
  joinedAt!: string;

  /**
   * How longer member has been boosting
   *
   * @type {(string | null)}
   * @memberof GuildMember
   */
  boosterSince!: string | null;

  /**
   * Is the member deafened
   *
   * @type {boolean}
   * @memberof GuildMember
   */
  deaf!: boolean;

  /**
   * Is the member muted
   *
   * @type {boolean}
   * @memberof GuildMember
   */
  mute!: boolean;

  /**
   * Flags the member hash
   *
   * @type {GuildMemberFlags}
   * @memberof GuildMember
   */
  flags!: GuildMemberFlags;

  /**
   * Is the member pending verification
   *
   * @type {boolean}
   * @memberof GuildMember
   */
  pending!: boolean;

  /**
   * If timed out, until when
   *
   * @type {(string | null)}
   * @memberof GuildMember
   */
  communicationDisabledUntil!: string | null;

  /**
   * Roles the member has
   *
   * @type {GuildMemberRoleManager}
   * @memberof GuildMember
   */
  roles: GuildMemberRoleManager;

  constructor(guild: Guild, data: APIGuildMember) {
    super(guild.client, data.user!.id);
    this.guild = guild;
    this.user = guild.client.users.add(data.user!);
    this.roles = new GuildMemberRoleManager(this);
    this.patch(data);
  }

  override patch(data: APIGuildMember) {
    this.nick = data.nick ?? null;
    this.avatar = data.avatar ?? null;
    for (const role of data.roles) this.roles.set(role, this.guild.roles.get(role)!);
    this.joinedAt = data.joined_at;
    this.boosterSince = data.premium_since ?? null;
    this.deaf = data.deaf;
    this.mute = data.mute;
    this.flags = data.flags;
    this.pending = data.pending ?? false;
    this.communicationDisabledUntil = data.communication_disabled_until ?? null;
  }
}
