import Timeline from './timeline';
import User from './user';

/**
 * Something to contain analysis data
 */
export default class Analysis {
  /**
   * Total number of messages
   */
  messages: number = 0;

  /**
   * The timeline
   */
  timeline: Timeline = new Timeline();
}
