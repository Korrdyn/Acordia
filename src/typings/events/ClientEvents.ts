import { GatewayDispatchPayload } from 'discord-api-types/v10';
import { Guild } from '@structures/Guild';
import { Message } from '@structures/Message';
import { UnavailableGuild } from '@structures/UnavailableGuild';
import { BaseChannel } from '@structures/BaseChannel';
import { Interaction } from '@structures/Interaction';
import { CommandErrorData } from '@clients/structures/CommandError';

export const enum Events {
  Ready = 'ready',
  ShardReady = 'shardReady',
  Debug = 'debug',
  Raw = 'raw',
  ShardDisconnect = 'shardDisconnect',
  ShardReconnecting = 'shardReconnecting',
  ShardError = 'shardError',
  GuildCreate = 'guildCreate',
  GuildDelete = 'guildDelete',
  GuildAvailable = 'guildAvailable',
  MessageCreate = 'messageCreate',
  ChannelCreate = 'channelCreate',
  ChannelUpdate = 'channelUpdate',
  ChannelDelete = 'channelDelete',
  InteractionCreate = 'interactionCreate',
  CommandError = 'commandError',
  CommandExecuted = 'commandExecuted',
  Error = 'error',
  Event = 'event',
}

export interface IEvents {
  /**
   * Emitted when a shard becomes ready
   * @event Client#shardReady
   * @param {number} id The shard that is ready
   * @param {Set<string>} [unavailableGuilds] Unavailable guilds
   *
   * @memberof IEvents
   */
  shardReady: (shard: number, unavailableGuilds?: Set<string>) => any;
  debug: (message: string) => any;
  ready: () => any;
  raw: (packet: GatewayDispatchPayload, shard: number) => any;
  shardDisconnect: (shard: number, code: number) => any;
  shardReconnecting: (shard: number) => any;
  shardError: (shard: number, error: Error) => any;
  guildCreate: (guild: Guild) => any;
  guildDelete: (guild: Guild | UnavailableGuild) => any;
  guildAvailable: (guild: Guild) => any;
  messageCreate: (message: Message) => any;
  channelCreate: (channel: BaseChannel) => any;
  // TODO: Make better type for old channel
  channelUpdate: (channel: BaseChannel, oldChannel: Record<string, unknown>) => any;
  channelDelete: (channel: BaseChannel) => any;
  interactionCreate: (interaction: Interaction) => any;
  commandError: (command: string, interaction: Interaction, data: CommandErrorData) => any;
  commandExecuted: (command: string, interaction: Interaction) => any;
  error: (error: Error | string, shard?: number) => any;
  event: (event: `${Events}`, ...args: any[]) => any;
}
