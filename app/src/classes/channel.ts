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
   * @param {string} id The ID of the channel
   */
  constructor(id: string) {
    super();
    this.id = id;
  }
}
