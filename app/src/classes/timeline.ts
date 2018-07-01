export default class Timeline {
  /**
   * Timeline of events
   */
  timeline: {
    [year: number]: {
      [month: number]: {
        [day: number]: number;
      };
    };
  } = {};

  /**
   * Create & populate a year in the timeline
   * @param {number} year The new year
   */
  private populateYear(year: number) {
    if (!this.timeline[year]) {
      this.timeline[year] = {};
      for (let month = 0; month < 12; month += 1) {
        this.timeline[year][month] = {};
        for (let day = 1; day <= new Date(year, month + 1, 0).getDate(); day += 1) {
          this.timeline[year][month][day] = 0;
        }
      }
    }
  }

  /**
   * Increment a date
   */
  increment(year: number, month: number, day: number) {
    this.populateYear(year);
    this.timeline[year][month][day] += 1;
  }
}
