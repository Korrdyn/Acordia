import { APIRole, APIRoleTags, RESTPatchAPIGuildRoleJSONBody, RESTPatchAPIGuildRoleResult, RoleFlags, Routes } from 'discord-api-types/v10';
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
    this._patch(data);
  }

  /**
   * @internal
   */
  override _patch(data: APIRole) {
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

  /**
   * Edit role
   *
   * @param {Object} options
   * @param {(string | null)} [options.name] - Name of the role
   * @param {(PermissionBitfield | string | null)} [options.permissions] - Bitwise value of permissions
   * @param {(number | null)} [options.color] - Decimal RGB color
   * @param {(boolean | null)} [options.hoist] - Should the role be hoisted
   * @param {(string | null)} [options.icon] - Data URI {@link https://discord.com/developers/docs/reference#image-data}
   * @param {(string | null)} [options.emoji] - Unicode emoji
   * @param {(boolean | null)} [options.mentionable] - Should the role mentionable
   * @param {string} [options.reason] - Reason for editing role
   * @return {*}  {Promise<Role>}
   * @memberof Role
   */
  async edit({
    name,
    permissions,
    color,
    hoist,
    icon,
    emoji,
    mentionable,
    reason,
  }: {
    name?: string | null;
    permissions?: PermissionBitfield | string | null;
    color?: number | null;
    hoist?: boolean | null;
    icon?: string | null;
    emoji?: string | null;
    mentionable?: boolean | null;
    reason?: string;
  }): Promise<Role> {
    const response = (await this.client.rest.patch(Routes.guildRole(this.guild.id, this.id), {
      body: {
        name,
        permissions: permissions instanceof PermissionBitfield ? permissions.bits.toString() : permissions,
        color,
        hoist,
        icon,
        unicode_emoji: emoji,
        mentionable,
      } as RESTPatchAPIGuildRoleJSONBody,
      reason,
    })) as RESTPatchAPIGuildRoleResult;
    this._patch(response);
    return this;
  }
}
