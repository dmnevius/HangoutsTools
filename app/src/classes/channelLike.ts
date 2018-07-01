import Analysis from './analysis';
import Timeline from './timeline';
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

  /**
   * The timeline
   */
  timeline: Timeline = new Timeline();
}
