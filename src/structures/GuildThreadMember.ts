import { Guild } from "@structures/Guild";
import { APIThreadMember, Snowflake, ThreadMemberFlags } from "discord-api-types/v10";

export class GuildThreadMember {
  guild: Guild;
  userId!: Snowflake;
  threadId: Snowflake | null = null;
  joinedAt!: number;
  flags!: ThreadMemberFlags;

  constructor(guild: Guild, data: APIThreadMember) {
    this.guild = guild;
    this._patch(data);
  }

  /**
   * @internal
   */
  _patch(data: APIThreadMember) {
    // user_id is not present on threads from GUILD_CREATE event so we can assume this member is self
    if (!data.user_id) {
      this.userId = this.guild.client.application.id;
    } else this.userId = data.user_id
    if (data.id) this.threadId = data.id;
    this.joinedAt = Date.parse(data.join_timestamp);
    if (data.member) this.guild.members._add(data.member);
    this.flags = data.flags;
  }

  get member() {
    return this.guild.members.get(this.userId) ?? null;
  }
}