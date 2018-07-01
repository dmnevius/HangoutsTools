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
    for (let year = years[0]; year <= years[years.length - 1]; year += 1) {
      for (let month = 0; month < 12; month += 1) {
        for (let day = 1; day <= Object.keys(timeline[year][month]).length; day += 1) {
          data.push(timeline[year][month][day]);
          labels.push(new Date(year, month, day).toDateString());
        }
      }
    }
    return {
      labels,
      datasets: [{
        label: (<Channel>this.data).name || 'Overview',
        data,
      }],
    };
  }
}
