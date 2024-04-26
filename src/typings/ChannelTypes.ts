import { MessageManager } from '@managers/MessageManager';
import { BaseChannel } from '@structures/BaseChannel';
import { Guild } from '@structures/Guild';
import { GuildStageChannel } from '@structures/GuildStageChannel';
import { GuildTextChannel } from '@structures/GuildTextChannel';
import { GuildVoiceChannel } from '@structures/GuildVoiceChannel';
import { GuildVoiceTextChannel } from '@structures/GuildVoiceTextChannel';

export type ChannelTypes = BaseChannel | GuildTextChannel | GuildVoiceChannel | GuildVoiceTextChannel | GuildStageChannel;
export type TextBasedChannel = Extract<ChannelTypes, { messages: MessageManager }>;
export type VoiceBasedChannel = Extract<ChannelTypes, { bitrate: number }>;
export type GuildBasedChannel = Extract<ChannelTypes, { guild: Guild }>;
