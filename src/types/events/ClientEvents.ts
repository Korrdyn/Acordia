import { GatewayDispatchPayload } from 'discord-api-types/v10';

export enum Events {
  Ready = 'ready',
  ShardReady = 'shardReady',
  Debug = 'debug',
  Raw = 'raw',
  ShardDisconnect = 'shardDisconnect',
  ShardReconnecting = 'shardReconnecting',
  ShardError = 'shardError'
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
}
