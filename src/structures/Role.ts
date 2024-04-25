import { APIRole, APIRoleTags, RoleFlags } from 'discord-api-types/v10';
import { Base } from '@structures/Base';
import { Guild } from '@structures/Guild';
import { PermissionBitfield } from '@utils/PermissionBitfield';

export class Role extends Base {
  /**
   * Name of the role
   *
   * @type {string}
   * @memberof Role
   */
  name!: string;

  /**
   * Role color
   *
   * @type {number}
   * @memberof Role
   */
  color!: number;

  /**
   * If role is hoisted
   *
   * @type {boolean}
   * @memberof Role
   */
  hoist!: boolean;

  /**
   * Icon hash
   *
   * @type {(string | null)}
   * @memberof Role
   */
  icon!: string | null;

  /**
   * Icon emoji
   *
   * @type {(string | null)}
   * @memberof Role
   */
  unicodeEmoji!: string | null;

  /**
   * Position of role in hierarchy
   *
   * @type {number}
   * @memberof Role
   */
  position!: number;

  /**
   * Permissions the role has
   *
   * @type {PermissionBitfield}
   * @memberof Role
   */
  permissions!: PermissionBitfield;

  /**
   * Whether role is managed by an integration
   *
   * @type {boolean}
   * @memberof Role
   */
  managed!: boolean;

  /**
   * Whether role is mentionable
   *
   * @type {boolean}
   * @memberof Role
   */
  mentionable!: boolean;

  /**
   * Tags attached to role
   *
   * @type {(APIRoleTags | null)}
   * @memberof Role
   */
  tags!: APIRoleTags | null;

  /**
   * Flags attached to role
   *
   * @type {RoleFlags}
   * @memberof Role
   */
  flags!: RoleFlags;

  /**
   * Guild this role belongs to
   *
   * @type {Guild}
   * @memberof Role
   */
  guild: Guild;

  constructor(guild: Guild, data: APIRole) {
    super(guild.client, data.id);
    this.guild = guild;
    this.patch(data);
  }

  override patch(data: APIRole) {
    this.name = data.name;
    this.color = data.color;
    this.hoist = data.hoist;
    this.icon = data.icon ?? null;
    this.unicodeEmoji = data.unicode_emoji ?? null;
    this.position = data.position;
    this.permissions = new PermissionBitfield(data.permissions);
    this.managed = data.managed;
    this.mentionable = data.mentionable;
    this.tags = data.tags ?? null;
    this.flags = data.flags;
  }
}
