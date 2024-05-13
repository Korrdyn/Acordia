import { Base } from "@structures/Base";
import { Guild } from "@structures/Guild";
import { APIGuildForumTag, Snowflake } from "discord-api-types/v10";

export class ForumTag extends Base {
  
  /**
   * The name of the tag.
   * 
   * 0-20 characters
   *
   * @type {string}
   * @memberof ForumTag
   */
  name: string;
  
  /**
   * Whether this tag can only be added to or removed from threads by a member with the `MANAGE_THREADS` permission
   *
   * @type {boolean}
   * @memberof ForumTag
   */
  moderated: boolean;
  // TODO: Use Emoji class
  emoji_id: Snowflake | null;
  emoji_name: string | null;
  
  constructor(guild: Guild, data: APIGuildForumTag) {
    super(guild.client, data.id);
    this.name = data.name;
    this.moderated = data.moderated;
    this.emoji_id = data.emoji_id;
    this.emoji_name = data.emoji_name;
  }
}