import Analysis from './analysis';

/**
 * A user within a guild
 */
export default class User extends Analysis {
  /**
   * The ID of the user
   */
  id: string;

  /**
   * @param {string} id The ID of the user
   */
  constructor(id: string) {
    super();
    this.id = id;
  }
}
