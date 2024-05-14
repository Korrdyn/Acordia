// Clients

export { Client } from '@clients/Client';
export { CommandClient } from '@clients/CommandClient';
export { type CooldownType, type CooldownLogic, CooldownHandler } from '@clients/CooldownHandler';
export { Shard } from '@clients/Shard';
export { ShardManager } from '@clients/ShardManager';
export { default as Command } from '@clients/structures/Command';
export { type default as Event } from '@clients/structures/Event';
export {
  CommandError,
  type CommandErrorData,
  type CommandSnowflakeError,
  type CommandCooldownError,
  type CommandPermissionError,
  type CommandMiddlewareError,
  type CommandUncaughtError,
} from '@clients/structures/CommandError';

// Managers

export { DMChannelManager } from '@managers/DMChannelManager';
export { GuildChannelManager } from '@managers/GuildChannelManager';
export { GuildManager } from '@managers/GuildManager';
export { GuildMemberManager } from '@managers/GuildMemberManager';
export { GuildMemberRoleManager } from '@managers/GuildMemberRoleManager';
export { GuildRoleManager } from '@managers/GuildRoleManager';
export { GuildThreadManager } from '@managers/GuildThreadManager';
export { GuildThreadMemberManager } from '@managers/GuildThreadMemberManager';
export { Manager } from '@managers/Manager';
export { MessageManager } from '@managers/MessageManager';
export { PermissionOverwriteManager } from '@managers/PermissionOverwriteManager';
export { UserManager } from '@managers/UserManager';

// Structures

export { AutocompleteInteraction } from '@structures/AutocompleteInteraction';
export { Base } from '@structures/Base';
export { BaseChannel } from '@structures/BaseChannel';
export { CommandInteraction } from '@structures/CommandInteraction';
export { ComponentInteraction } from '@structures/ComponentInteraction';
export { DMChannel } from '@structures/DMChannel';
export { ForumTag } from '@structures/ForumTag';
export { Guild } from '@structures/Guild';
export { GuildCategoryChannel } from '@structures/GuildCategoryChannel';
export { GuildChannel } from '@structures/GuildChannel';
export { GuildForumChannel } from '@structures/GuildForumChannel';
export { GuildMember } from '@structures/GuildMember';
export { GuildNewsChannel } from '@structures/GuildNewsChannel';
export { GuildStageChannel } from '@structures/GuildStageChannel';
export { GuildStageInstance } from '@structures/GuildStageInstance';
export { GuildStoreChannel } from '@structures/GuildStoreChannel';
export { GuildTextChannel } from '@structures/GuildTextChannel';
export { GuildThreadChannel } from '@structures/GuildThreadChannel';
export { GuildThreadMember } from '@structures/GuildThreadMember';
export { GuildVoiceChannel } from '@structures/GuildVoiceChannel';
export { GuildVoiceTextChannel } from '@structures/GuildVoiceTextChannel';
export { Interaction } from '@structures/Interaction';
export { Message } from '@structures/Message';
export { ModalSubmitInteraction } from '@structures/ModalSubmitInteraction';
export { PartialApplication } from '@structures/PartialApplication';
export { PartialGuild } from '@structures/PartialGuild';
export { PingInteraction } from '@structures/PingInteraction';
export { Role } from '@structures/Role';
export { UnavailableGuild } from '@structures/UnavailableGuild';
export { User } from '@structures/User';

// Typings

export type { Events, IEvents } from '@typings/events/ClientEvents';
export type { ShardEvents, IShardEvents } from '@typings/events/ShardEvents';
export type { ChannelTypes, TextBasedChannel, VoiceBasedChannel, GuildBasedChannel } from '@typings/ChannelTypes';
export type { IClientOptions, ICommandClientOptions } from '@typings/ClientOptions';

// Utils

export { AcordiaError } from '@utils/AcordiaError';
export { Bitfield } from '@utils/Bitfield';
export { GatewayIntentBitfield } from '@utils/GatewayIntentBitfield';
export { MessageFlagBitfield } from '@utils/MessageFlagBitfield';
export { Options, type IClientOptionDefaults } from '@utils/Options';
export { PermissionBitfield } from '@utils/PermissionBitfield';
export { PermissionOverwrite } from '@utils/PermissionOverwrite';
export { Status } from '@utils/Status';
export { flatten } from '@utils/Utils';

export * from 'discord-api-types/v10';
