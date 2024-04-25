export enum ShardEvents {
  WaitingForGuilds = 'waitingForGuilds',
  Ready = 'ready',
  Close = 'close',
  Resume = 'resume'
}

export interface IShardEvents {
  /**
   * Emitted when the shard is waiting for guilds
   *
   * @memberof IShardEvents
   */
  waitingForGuilds: () => any;

  /**
   * Emitted when shard got all shards or timeout expired
   *
   * @memberof IShardEvents
   */
  ready: (unavailableGuilds?: Set<string>) => any;

  close: (code: number) => any;
  resume: () => any;
}
