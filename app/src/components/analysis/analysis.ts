import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Vue from 'vue';
import VueChart from 'vue-chart-js';
import Channel from '../../classes/channel';
import ChannelLike from '../../classes/channelLike';

@Component({
  components: {
    VueChart,
  },
})

export default class AnalysisComponent extends Vue {
  /**
   * Data to display
   */
  @Prop()
  data: ChannelLike;

  /**
   * Total number of users
   */
  get userCount() {
    return Object.keys(this.data.users).length;
  }
  
  /**
   * Formatted timeline chart
   */
  get timelineChart() {
    const labels = [];
    const data = [];
    const timeline = this.data.timeline.timeline;
    const years = Object.keys(timeline).map((year) => {
      return Number(year);
    });
    let hasStarted = false;
    let hasEnded = false;
    let lastYear = years[years.length - 1];
    let lastMonth;
    let lastDay;
    for (let month = 0; month < 12; month += 1) {
      for (let day = 1; day <= Object.keys(timeline[lastYear][month]).length; day += 1) {
        if (timeline[lastYear][month][day] > 0) {
          lastMonth = month;
          lastDay = day;
        }
      }
    }
    for (let year = years[0]; year <= lastYear; year += 1) {
      for (let month = 0; month < 12; month += 1) {
        for (let day = 1; day <= Object.keys(timeline[year][month]).length; day += 1) {
          if (timeline[year][month][day] > 0) {
            hasStarted = true;
          }
          if (year === lastYear && month === lastMonth && day > lastDay) {
            hasEnded = true;
          }
          if (hasStarted && !hasEnded) {
            data.push(timeline[year][month][day]);
            labels.push(new Date(year, month, day).toDateString());
          }
        }
      }
    }
    return {
      labels,
      datasets: [{
        label: (<Channel>this.data).name || 'Overview',
        data,
        backgroundColor: '#4CAF50',
        borderColor: '#81C784',
      }],
    };
  }
}
