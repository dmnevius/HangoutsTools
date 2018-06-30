import Analysis from './analysis';
import User from './user';

/**
 * Similar data structure to a channel
 */
export default class ChannelLike extends Analysis {
  /**
   * A dictionary of users
   */
  users: {
    [id: string]: User;
  } = {};
}
