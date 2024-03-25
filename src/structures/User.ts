import { APIUser, UserFlags } from 'discord-api-types/v10';
import { Client } from '../clients/Client';
import { Base } from './Base';

export class User extends Base {
  username!: string;
  discriminator!: string;
  globalName!: string | null;
  avatar!: string | null;
  avatarDecoration!: string | null;
  bot!: boolean;
  system!: boolean;
  banner!: string | null;
  accentColor!: number | null;
  flags!: UserFlags | null;

  constructor(client: Client, data: APIUser) {
    super(client, data.id);
    this.client = client;
    this.patch(data);
  }

  override patch(data: APIUser) {
    this.id = data.id;
    this.username = data.username;
    this.discriminator = data.discriminator;
    this.globalName = data.global_name;
    this.avatar = data.avatar;
    this.avatarDecoration = data.avatar_decoration ?? null;
    this.bot = data.bot ?? false;
    this.system = data.system ?? false;
    this.banner = data.banner ?? null;
    this.accentColor = data.accent_color ?? null;
    this.flags = data.flags ?? null;
  }
}
