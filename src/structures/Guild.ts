import {
  APIEmoji,
  APIGuild,
  APIGuildWelcomeScreen,
  APISticker,
  GatewayGuildCreateDispatchData,
  GuildDefaultMessageNotifications,
  GuildExplicitContentFilter,
  GuildHubType,
  GuildMFALevel,
  GuildNSFWLevel,
  GuildPremiumTier,
  GuildSystemChannelFlags,
} from 'discord-api-types/v10';
import { Shard } from '@clients/Shard';
import { PartialGuild } from '@structures/PartialGuild';
import { GuildMemberManager } from '@managers/GuildMemberManager';
import { GuildRoleManager } from '@managers/GuildRoleManager';
import { GuildChannelManager } from '@managers/GuildChannelManager';
import { APIGuildChannelType } from '@structures/GuildChannel';

export class Guild extends PartialGuild {
  ownerId!: string;
  discoverySplash!: string | null;
  afkChannelId!: string | null;
  afkTimeout!: 1800 | 3600 | 60 | 300 | 900;
  widgetEnabled!: boolean;
  widgetChannelId!: string | null;
  defaultMessageNotifications!: GuildDefaultMessageNotifications;
  explicitContentFilter!: GuildExplicitContentFilter;
  emojis!: APIEmoji[];
  mfaLevel!: GuildMFALevel;
  systemChannelId!: string | null;
  systemChannelFlags!: GuildSystemChannelFlags;
  rulesChannelId!: string | null;
  maxPresences!: number | null;
  maxMembers!: number | null;
  boostTier!: GuildPremiumTier;
  boostCount!: number | null;
  boostBarEnabled!: boolean;
  preferredLocale!: string;
  publicUpdatesChannel!: string | null;
  welcomeScreen!: APIGuildWelcomeScreen | null;
  nsfwLevel!: GuildNSFWLevel;
  stickers!: APISticker[];
  hubType!: GuildHubType | null;
  safetyAlertChannelId!: string | null;
  members: GuildMemberManager;
  membersCount!: number;
  roles: GuildRoleManager;
  channels: GuildChannelManager;

  constructor(shard: Shard, data: GatewayGuildCreateDispatchData) {
    super(shard, data);
    this.members = new GuildMemberManager(this);
    this.roles = new GuildRoleManager(this);
    this.channels = new GuildChannelManager(this);
    this._patch(data);
  }

  override _patch(guild: GatewayGuildCreateDispatchData | APIGuild) {
    super._patch(guild);
    this.ownerId = guild.owner_id;
    this.discoverySplash = guild.discovery_splash;
    this.afkChannelId = guild.afk_channel_id;
    this.afkTimeout = guild.afk_timeout;
    this.widgetEnabled = guild.widget_enabled ?? false;
    this.widgetChannelId = guild.widget_channel_id ?? null;
    this.defaultMessageNotifications = guild.default_message_notifications;
    this.explicitContentFilter = guild.explicit_content_filter;
    this.emojis = guild.emojis;
    this.mfaLevel = guild.mfa_level;
    this.systemChannelId = guild.system_channel_id;
    this.systemChannelFlags = guild.system_channel_flags;
    this.rulesChannelId = guild.rules_channel_id;
    this.maxPresences = guild.max_presences ?? null;
    this.maxMembers = guild.max_members ?? null;
    this.boostTier = guild.premium_tier;
    this.boostCount = guild.premium_subscription_count ?? null;
    this.boostBarEnabled = guild.premium_progress_bar_enabled;
    this.preferredLocale = guild.preferred_locale;
    this.publicUpdatesChannel = guild.public_updates_channel_id;
    this.welcomeScreen = guild.welcome_screen ?? null;
    this.nsfwLevel = guild.nsfw_level;
    this.stickers = guild.stickers;
    this.hubType = guild.hub_type ?? null;
    this.safetyAlertChannelId = guild.safety_alerts_channel_id;

    for (const role of guild.roles) this.roles._add(role);

    if ('channels' in guild) {
      // data is GatewayGuildCreateDispatchData

      this.membersCount = guild.member_count;

      for (const member of guild.members) this.members._add(member);

      for (const channel of guild.channels) this.channels._add(channel as APIGuildChannelType);
    }
  }

  get self() {
    return this.members.get(this.client.application.id)!;
  }
}
