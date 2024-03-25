import {
  APIEmoji,
  APIGuild,
  APIGuildWelcomeScreen,
  APIRole,
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
import { Shard } from '../clients/Shard';
import { BaseGuild } from './BaseGuild';
import { GuildMemberManager } from '../managers/GuildMemberManager';

export class Guild extends BaseGuild {
  ownerId!: string;
  discoverySplash!: string | null;
  afkChannelId!: string | null;
  afkTimeout!: 1800 | 3600 | 60 | 300 | 900;
  widgetEnabled!: boolean;
  widgetChannelId!: string | null;
  defaultMessageNotifications!: GuildDefaultMessageNotifications;
  explicitContentFilter!: GuildExplicitContentFilter;
  roles!: APIRole[];
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

  constructor(shard: Shard, data: GatewayGuildCreateDispatchData) {
    super(shard, data);
    this.members = new GuildMemberManager(this);
    this.patch(data);
  }

  override patch(guild: GatewayGuildCreateDispatchData | APIGuild) {
    super.patch(guild);
    this.ownerId = guild.owner_id;
    this.discoverySplash = guild.discovery_splash;
    this.afkChannelId = guild.afk_channel_id;
    this.afkTimeout = guild.afk_timeout;
    this.widgetEnabled = guild.widget_enabled ?? false;
    this.widgetChannelId = guild.widget_channel_id ?? null;
    this.defaultMessageNotifications = guild.default_message_notifications;
    this.explicitContentFilter = guild.explicit_content_filter;
    this.roles = guild.roles;
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

    if ('channels' in guild) {
      // data is GatewayGuildCreateDispatchData

      this.membersCount = guild.member_count;

      for (const member of guild.members) {
        this.members.add(member);
      }
    }
  }
}
