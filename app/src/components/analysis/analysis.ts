import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Vue from 'vue';
import VueChart from 'vue-chart-js';
import Channel from '../../classes/channel';
import ChannelLike from '../../classes/channelLike';

const colorList = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];

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
   * Default chart options to maximize readability
   */
  defaultChartOptions = {
    legend: {
      display: false,
    },
    scales: {
      xAxes: [{
        display: false,
      }],
    },
  };
  
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
            if (timeline[year][month][day] > 0) {
              data.push(timeline[year][month][day]);
            } else {
              data.push(null);
            }
            labels.push(new Date(year, month, day).toDateString());
          }
        }
      }
    }
    return {
      labels,
      datasets: [{
        label: 'Messages',
        data,
        borderColor: '#4CAF50',
        fill: false,
      }],
    };
  }

  /**
   * The user pie graph
   */
  get userChart() {
    const labels = [];
    const colors = [];
    let nextColor = 0;
    const data = [];
    for (const id in this.data.users) {
      const user = this.data.users[id];
      labels.push(user.name);
      colors.push(colorList[nextColor]);
      data.push(user.messages);
      nextColor += 1;
      if (nextColor >= colorList.length) {
        nextColor = 0;
      }
    }
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
      }]
    }
  }
}
