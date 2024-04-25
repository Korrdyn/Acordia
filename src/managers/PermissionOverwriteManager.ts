import { Collection } from '@discordjs/collection';
import { PermissionOverwrite } from '@utils/PermissionOverwrite';
import { APIOverwrite } from 'discord-api-types/v10';

export class PermissionOverwriteManager extends Collection<string, PermissionOverwrite> {
  add(data: APIOverwrite) {
    const overwrite = new PermissionOverwrite(data);
    this.set(overwrite.id, overwrite);
    return overwrite;
  }

  resolve(overwrite: PermissionOverwrite | string): PermissionOverwrite | null {
    if (overwrite instanceof PermissionOverwrite) return overwrite;
    return this.get(overwrite) ?? null;
  }

  resolveId(overwrite: PermissionOverwrite | string): string {
    if (overwrite instanceof PermissionOverwrite) return overwrite.id;
    return overwrite;
  }
}
