import { APIPartialGuild, GuildFeature, GuildVerificationLevel } from 'discord-api-types/v10';
import { Shard } from '../clients/Shard';
import { Base } from './Base';

export class BaseGuild extends Base {
  name!: string;
  description!: string | null;
  splash!: string | null;
  banner!: string | null;
  verificationLevel!: GuildVerificationLevel;
  icon!: string | null;
  features!: GuildFeature[];
  vanityCode!: string | null;
  shardId: number;

  constructor(shard: Shard, guild: APIPartialGuild) {
    super(shard.client, guild.id);
    this.shardId = shard.id;
  }

  override patch(guild: APIPartialGuild) {
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
