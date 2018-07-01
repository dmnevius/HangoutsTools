import ChannelLike from './channelLike';
import User from './user';

/**
 * A channel within a project
 */
export default class Channel extends ChannelLike {
  /**
   * The ID of the channel
   */
  id: string;

  /**
   * The name of the channel
   */
  name: string;

  /**
   * @param {string} id The ID of the channel
   * @param {string} name The name of the channel
   */
  constructor(id: string, name: string) {
    super();
    this.id = id;
    this.name = name;
  }

  /**
   * Add a user
   * @param {User} user The new user
   */
  addUser(user: User) {
    if (!this.users[user.id]) {
      this.users[user.id] = user;
    }
  }

  /**
   * Add a message
   * @param {User} sender The sender of the message
   */
  addMessage(sender: User) {
    this.messages += 1;
    if (!this.users[sender.id]) {
      this.addUser(sender);
    }
    this.users[sender.id].messages += 1;
  }
}
