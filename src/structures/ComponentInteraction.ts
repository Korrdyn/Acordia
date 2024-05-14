import { Client } from '@clients/Client';
import { Collection } from '@discordjs/collection';
import { BaseChannel } from '@structures/BaseChannel';
import { APIGuildChannelType } from '@structures/GuildChannel';
import { GuildMember } from '@structures/GuildMember';
import { Interaction } from '@structures/Interaction';
import { Message } from '@structures/Message';
import { Role } from '@structures/Role';
import { User } from '@structures/User';
import {
  APIGuildMember,
  APIMessageComponentInteraction,
  APIMessageComponentInteractionData,
  ComponentType,
  InteractionResponseType,
} from 'discord-api-types/v10';

export type StringSelectMenuInteraction = Omit<ComponentInteraction, 'selected'> & { selected: string[] };
export type ChannelSelectMenuInteraction = Omit<ComponentInteraction, 'selected'> & { selected: Collection<string, BaseChannel> };
export type RoleSelectMenuInteraction = Omit<ComponentInteraction, 'selected'> & { selected: Collection<string, Role> };
export type UserSelectMenuInteraction = Omit<ComponentInteraction, 'selected'> & { selected: Collection<string, User> };
export type MentionableSelectMenuInteraction = Omit<ComponentInteraction, 'selected'> & { selected: Array<User | GuildMember | Role> };

export class ComponentInteraction extends Interaction {
  data: APIMessageComponentInteractionData;
  message: Message | null = null;
  selected: any;
  constructor(client: Client, data: APIMessageComponentInteraction) {
    super(client, data);
    this.data = data.data;
    if (data.message !== undefined && this.channel) {
      this.message = this.channel.messages._add(data.message);
    }
    if ('values' in data.data) {
      switch (data.data.component_type) {
        case ComponentType.StringSelect:
          this.selected = data.data.values;
          break;
        case ComponentType.ChannelSelect: {
          const channels = new Collection<string, BaseChannel>();
          Object.entries(data.data.resolved.channels).forEach(([id, channel]) => {
            channels.set(id, this.guild?.channels._add(channel as unknown as APIGuildChannelType)!);
          });
          this.selected = channels;
          break;
        }
        case ComponentType.RoleSelect: {
          const roles = new Collection<string, Role>();
          Object.entries(data.data.resolved.roles).forEach(([id, role]) => {
            roles.set(id, this.guild?.roles._add(role) ?? new Role(this.guild!, role));
          });
          this.selected = roles;
          break;
        }
        case ComponentType.UserSelect: {
          const users = new Collection<string, User>();
          Object.entries(data.data.resolved.users).forEach(([id, user]) => {
            users.set(id, this.client.users._add(user));
          });
          this.selected = users;
          break;
        }
        case ComponentType.MentionableSelect: {
          const a = [];
          if (data.data.resolved.members && this.guild)
            a.push(...Object.entries(data.data.resolved.members).map(([_, user]) => this.guild?.members._add(user as unknown as APIGuildMember)));
          if (data.data.resolved.users) a.push(...Object.entries(data.data.resolved.users).map(([_, user]) => this.client.users._add(user)));
          if (data.data.resolved.roles && this.guild)
            a.push(...Object.entries(data.data.resolved.roles).map(([_, role]) => this.guild?.roles._add(role) ?? new Role(this.guild!, role)));
          this.selected = a;
          break;
        }
      }
    }
  }

  isStringSelect(): this is StringSelectMenuInteraction {
    return this.data.component_type === ComponentType.StringSelect;
  }

  isChannelSelect(): this is StringSelectMenuInteraction {
    return this.data.component_type === ComponentType.ChannelSelect;
  }

  isRoleSelect(): this is RoleSelectMenuInteraction {
    return this.data.component_type === ComponentType.RoleSelect;
  }

  isUserSelect(): this is UserSelectMenuInteraction {
    return this.data.component_type === ComponentType.UserSelect;
  }

  isMentionableSelect(): this is MentionableSelectMenuInteraction {
    return this.data.component_type === ComponentType.MentionableSelect;
  }

  isButton() {
    return this.data.component_type === ComponentType.Button;
  }

  override deferUpdate(): Promise<unknown> {
    return this.respond({ type: InteractionResponseType.DeferredMessageUpdate });
  }
}
