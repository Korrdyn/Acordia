import { GuildThreadMemberManager } from '@managers/GuildThreadMemberManager';
import { Guild } from '@structures/Guild';
import { GuildTextChannel } from '@structures/GuildTextChannel';
import {
  APIChannel,
  APIThreadChannel,
  ChannelType,
  GatewayThreadMembersUpdate,
  RESTGetAPIChannelThreadMembersResult,
  Routes,
  Snowflake,
} from 'discord-api-types/v10';

type DataType = APIThreadChannel | APIChannel | GatewayThreadMembersUpdate;

export class GuildThreadChannel extends GuildTextChannel {
  members: GuildThreadMemberManager;
  ownerId: Snowflake | null;
  lastMessageId!: Snowflake | null;
  memberCount: number | null = null;
  threadMetadata: {
    archiveTimestamp: number;
    archived: boolean;
    autoArchiveDuration: number;
    locked: boolean | undefined;
    invitable: boolean | undefined;
  } | null = null;

  constructor(guild: Guild, data: APIThreadChannel) {
    super(guild, data as APIThreadChannel);
    this.members = new GuildThreadMemberManager(guild);
    this.ownerId = data.owner_id ?? null;

    this._patch(data);
  }

  /**
   * @internal
   */
  override _patch(data: DataType) {
    super._patch(data as unknown as APIThreadChannel);
    if ('member_count' in data && data.member_count) this.memberCount = data.member_count;
    if ('thread_metadata' in data && data.thread_metadata !== undefined) {
      this.threadMetadata = {
        archiveTimestamp: Date.parse(data.thread_metadata.archive_timestamp),
        archived: data.thread_metadata.archived,
        autoArchiveDuration: data.thread_metadata.auto_archive_duration,
        locked: data.thread_metadata.locked,
        invitable: data.thread_metadata.invitable,
      };
    }
    if ('member' in data) this.members._add(data.member);
  }

  isPrivate() {
    return this.type === ChannelType.PrivateThread;
  }

  /**
   * Fetch thread members from API
   *
   * @return {*}  {Promise<GuildThreadMemberManager>}
   * @memberof GuildThreadChannel
   */
  async fetchMembers(): Promise<GuildThreadMemberManager> {
    const response = (await this.client.rest.get(Routes.threadMembers(this.id))) as RESTGetAPIChannelThreadMembersResult;
    for (const member of response) this.members._add(member);
    return this.members;
  }

  /**
   * Add a member to thread
   *
   * @param {Snowflake} [userId="@me"] - Id of member to add to thread
   * @return {*}
   * @memberof GuildThreadChannel
   */
  join(userId: Snowflake = '@me') {
    return this.client.rest.put(Routes.threadMembers(this.id, userId ?? '@me'));
  }

  /**
   * Remove member from thread
   *
   * @param {Snowflake} [userId='@me'] - Id of member to remove from thread
   * @return {*}
   * @memberof GuildThreadChannel
   */
  leave(userId: Snowflake = '@me') {
    return this.client.rest.delete(Routes.threadMembers(this.id, userId ?? '@me'));
  }
}
