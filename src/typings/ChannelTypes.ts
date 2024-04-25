import { MessageManager } from '@managers/MessageManager';
import { BaseChannel } from '@structures/BaseChannel';
import { Guild } from '@structures/Guild';
import { GuildTextChannel } from '@structures/GuildTextChannel';

export type ChannelTypes = BaseChannel | GuildTextChannel;
export type TextBasedChannel = Extract<ChannelTypes, { messages: MessageManager }>;
export type GuildBasedChannel = Extract<ChannelTypes, { guild: Guild }>;
