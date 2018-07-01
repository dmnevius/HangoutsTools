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
   * The color of the user (for consistency)
   */
  color: string;

  /**
   * @param {string} id The ID of the user
   * @param {string} name The nickname of the user
   * @param {string} color The color of the user
   */
  constructor(id: string, name: string, color: string) {
    super();
    this.id = id;
    this.name = name;
    this.color = color;
  }
}
