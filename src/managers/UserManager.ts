import { APIUser } from 'discord-api-types/v10';
import { User } from '../structures/User';
import { Manager } from './Manager';

export class UserManager extends Manager<User> {
  add(data: APIUser) {
    let user = this.get(data.id);
    if (user) {
      user.patch(data);
    } else {
      user = new User(this.client, data);
      this.set(data.id, user);
    }
    return user;
  }
}
