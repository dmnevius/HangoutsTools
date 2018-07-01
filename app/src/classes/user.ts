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
   * The nickname of the user
   */
  name: string;

  /**
   * @param {string} id The ID of the user
   * @param {string} name The nickname of the user
   */
  constructor(id: string, name: string) {
    super();
    this.id = id;
    this.name = name;
  }
}
