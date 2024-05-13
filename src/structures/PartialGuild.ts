import { APIPartialGuild, GuildFeature, GuildVerificationLevel } from 'discord-api-types/v10';
import { Shard } from '@clients/Shard';
import { Base } from '@structures/Base';

export class PartialGuild extends Base {
  /**
   * Guild name
   *
   * @type {string}
   * @memberof BaseGuild
   */
  name!: string;

  /**
   * Guild description
   *
   * @type {(string | null)}
   * @memberof BaseGuild
   */
  description!: string | null;

  /**
   * Splash hash
   *
   * @type {(string | null)}
   * @memberof BaseGuild
   */
  splash!: string | null;

  /**
   * Banner hash
   *
   * @type {(string | null)}
   * @memberof BaseGuild
   */
  banner!: string | null;

  /**
   * Verification level
   *
   * @type {GuildVerificationLevel}
   * @memberof BaseGuild
   */
  verificationLevel!: GuildVerificationLevel;

  /**
   * Icon hash
   *
   * @type {(string | null)}
   * @memberof PartialGuild
   */
  icon!: string | null;

  /**
   * Features guild has
   *
   * @type {GuildFeature[]}
   * @memberof PartialGuild
   */
  features!: GuildFeature[];

  /**
   * Vanity invite code
   *
   * @type {(string | null)}
   * @memberof PartialGuild
   */
  vanityCode!: string | null;

  /**
   * Shard number
   *
   * @type {number}
   * @memberof PartialGuild
   */
  shardId: number;

  constructor(shard: Shard, guild: APIPartialGuild) {
    super(shard.client, guild.id);
    this.shardId = shard.id;
  }

  /**
   * @internal
   */
  override _patch(guild: APIPartialGuild) {
    this.id = guild.id;
    this.name = guild.name;
    this.description = guild.description ?? null;
    this.splash = guild.splash;
    this.banner = guild.banner ?? null;
    this.verificationLevel = guild.verification_level ?? GuildVerificationLevel.None;
    this.vanityCode = guild.vanity_url_code ?? null;
    this.icon = guild.icon;
    this.features = guild.features ?? [];
  }

  get shard() {
    return this.client.shards.get(this.shardId)!;
  }
}
