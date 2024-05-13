import { MessageManager } from '@managers/MessageManager';
import { BaseChannel } from '@structures/BaseChannel';
import { DMChannel } from '@structures/DMChannel';
import { Guild } from '@structures/Guild';
import { GuildCategoryChannel } from '@structures/GuildCategoryChannel';
import { GuildForumChannel } from '@structures/GuildForumChannel';
import { GuildNewsChannel } from '@structures/GuildNewsChannel';
import { GuildStageChannel } from '@structures/GuildStageChannel';
import { GuildStoreChannel } from '@structures/GuildStoreChannel';
import { GuildTextChannel } from '@structures/GuildTextChannel';
import { GuildThreadChannel } from '@structures/GuildThreadChannel';
import { GuildVoiceChannel } from '@structures/GuildVoiceChannel';
import { GuildVoiceTextChannel } from '@structures/GuildVoiceTextChannel';

export type ChannelTypes = BaseChannel | GuildTextChannel | GuildVoiceChannel | GuildVoiceTextChannel | GuildStageChannel | GuildCategoryChannel | GuildForumChannel | GuildStoreChannel | GuildNewsChannel | GuildThreadChannel | DMChannel;
export type TextBasedChannel = Extract<ChannelTypes, { messages: MessageManager }>;
export type VoiceBasedChannel = Extract<ChannelTypes, { bitrate: number }>;
export type GuildBasedChannel = Extract<ChannelTypes, { guild: Guild }>;
