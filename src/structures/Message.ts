import {
  APIActionRowComponent,
  APIApplication,
  APIAttachment,
  APIChannel,
  APIChannelMention,
  APIEmbed,
  APIGuildMember,
  APIInteractionDataResolved,
  APIMessage,
  APIMessageActionRowComponent,
  APIMessageActivity,
  APIMessageInteraction,
  APIMessageReference,
  APIMessageRoleSubscriptionData,
  APIReaction,
  APIStickerItem,
  GatewayMessageCreateDispatchData,
  MessageType,
} from 'discord-api-types/v10';
import { Base } from '@structures/Base';
import { GuildMember } from '@structures/GuildMember';
import { User } from '@structures/User';
import { Collection } from '@discordjs/collection';
import { MessageFlagBitfield } from '@utils/MessageFlagBitfield';
import { TextBasedChannel } from '@typings/ChannelTypes';
import { Guild } from '@structures/Guild';

export class Message extends Base {
  member: GuildMember | null = null;
  channel: TextBasedChannel;
  mentions = new Collection<string, User>();
  author!: User;
  content!: string;
  timestamp!: string;
  editedTimestamp!: string | null;
  tts!: boolean;
  mentionsEveryone!: boolean;
  mentionedRoles!: string[];
  mentionedChannels!: APIChannelMention[];
  attachments!: APIAttachment[];
  embeds!: APIEmbed[];
  reactions!: APIReaction[];
  nonce!: string | number | null;
  pinned!: boolean;
  webhookId!: string | null;
  type!: MessageType;
  activity!: APIMessageActivity | null;
  application!: Partial<APIApplication> | null;
  applicationId!: string | null;

  /**
   * Reference data sent with cross posted messages, replies, pins, and thread starter messages
   *
   * @type {(APIMessageReference | null)}
   * @memberof Message
   */
  messageReference!: APIMessageReference | null;
  flags!: MessageFlagBitfield;

  /**
   * This field is only returned for reply messages
   *
   * If the field exists but is `null`, the referenced message was deleted
   *
   * @type {(APIMessage | null | undefined)}
   * @memberof Message
   */
  referencedMessage: APIMessage | null | undefined;
  interaction!: APIMessageInteraction | null;
  thread!: APIChannel | null;
  components!: APIActionRowComponent<APIMessageActionRowComponent>[];
  stickers!: APIStickerItem[];
  position!: number | null;
  roleSubscriptionData!: APIMessageRoleSubscriptionData | null;
  resolved!: APIInteractionDataResolved | null;

  constructor(channel: TextBasedChannel, data: GatewayMessageCreateDispatchData) {
    super(channel.client, data.id);
    this.channel = channel;
    this.patch(data);
  }

  override patch(data: GatewayMessageCreateDispatchData) {
    this.author = this.client.users.add(data.author);
    this.content = data.content;
    this.timestamp = data.timestamp;
    this.editedTimestamp = data.edited_timestamp;
    this.tts = data.tts;
    this.mentionsEveryone = data.mention_everyone;

    this.mentions.clear();
    for (const mention of data.mentions) {
      this.mentions.set(mention.id, this.client.users.add(mention));
      if (mention.member && this.guild) {
        const member = mention.member as APIGuildMember;
        member.user = mention;
        this.guild.members.add(member);
      }
    }

    if (data.member && this.guild) {
      data.member.user = data.author;
      this.member = this.guild.members.add(data.member);
    }

    this.mentionedRoles = data.mention_roles;
    // TODO: Parse channel mentions once channels are done
    this.mentionedChannels = data.mention_channels ?? [];

    this.attachments = data.attachments;
    this.embeds = data.embeds;
    this.reactions = data.reactions ?? [];
    this.nonce = data.nonce ?? null;
    this.pinned = data.pinned;
    this.webhookId = data.webhook_id ?? null;
    this.type = data.type;
    this.activity = data.activity ?? null;
    this.application = data.application ?? null;
    this.applicationId = data.application_id ?? null;
    this.messageReference = data.message_reference ?? null;
    this.flags = new MessageFlagBitfield(data.flags ?? 0);
    this.referencedMessage = data.referenced_message;
    this.interaction = data.interaction ?? null;
    this.thread = data.thread ?? null;
    this.components = data.components ?? [];
    this.stickers = data.sticker_items ?? [];
    this.position = data.position ?? null;
    this.roleSubscriptionData = data.role_subscription_data ?? null;
    this.resolved = data.resolved ?? null;
  }

  get guild(): Guild | null {
    return this.channel.guild ?? null;
  }
}
