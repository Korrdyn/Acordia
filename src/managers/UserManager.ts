import { Manager } from '@managers/Manager';
import { User } from '@structures/User';
import { APIUser } from 'discord-api-types/v10';

export class UserManager extends Manager<User> {
  
  /**
   * Add/update user from payload
   *
   * @param {APIUser} data
   * @return {*}  {User}
   * @memberof UserManager
   * @internal
   */
  _add(data: APIUser): User {
    let user = this.get(data.id);
    if (user) {
      user._patch(data);
    } else {
      user = new User(this.client, data);
      this.set(data.id, user);
    }
    return user;
  }
}
