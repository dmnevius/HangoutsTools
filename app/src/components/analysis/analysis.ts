import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import Vue from 'vue';
import VueChart from 'vue-chart-js';
import Channel from '../../classes/channel';
import ChannelLike from '../../classes/channelLike';
import Timeline from '../../classes/timeline';
import User from '../../classes/user';
import colorList from '../../util/colorList';

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
   * Property of this.data to generate the split timeline from
   */
  @Prop({
    default: 'users',
  })
  splitTimeline: string;

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
   * Option to exclude users with an insignificant number of messages from the pie chart
   */
  excludeTinyData: boolean = true;

  /**
   * Formatted timeline chart
   */
  timelineChart = {
    labels: [],
    datasets: [],
  };

  /**
   * Formatted timeline chart, divided by channel
   */
  splitTimelineChart = {
    labels: [],
    datasets: [],
  };

  created() {
    this.updateUserChart();
    this.updateTimelineChart();
    this.updateSplitTimelineChart();
  }

  /**
   * Get bounds of data from a timeline
   */
  private getTimelineBounds(timeline: Timeline) {
    const years = Object.keys(timeline.timeline);
    const lastYear = Number(years[years.length - 1]);
    let lastMonth;
    let lastDay;
    for (let month = 0; month < 12; month += 1) {
      for (let day = 1; day <= Object.keys(timeline.timeline[lastYear][month]).length; day += 1) {
        if (timeline.timeline[lastYear][month][day] > 0) {
          lastMonth = month;
          lastDay = day;
        }
      }
    }
    return {
      lastYear,
      lastMonth,
      lastDay,
    };
  }
  
  /**
   * Update the timeline chart
   */
  updateTimelineChart() {
    const labels = [];
    const data = [];
    const timeline = this.data.timeline.timeline;
    const years = Object.keys(timeline).map((year) => {
      return Number(year);
    });
    let hasStarted = false;
    let hasEnded = false;
    const { lastYear, lastMonth, lastDay } = this.getTimelineBounds(this.data.timeline);
    for (let year = years[0]; year <= lastYear; year += 1) {
      if (timeline[year]) {
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
    }
    this.$set(this.timelineChart, 'labels', labels);
    this.$set(this.timelineChart, 'datasets', [{
      label: 'Messages',
      data,
      borderColor: '#4CAF50',
      fill: false,
    }]);
  }

  /**
   * Updates the split timeline chart
   */
  updateSplitTimelineChart() {
    const labels = [];
    const datasets = [];
    const years = Object.keys(this.data.timeline.timeline).map((year) => {
      return Number(year);
    });
    const { lastYear, lastMonth, lastDay } = this.getTimelineBounds(this.data.timeline);
    const globalTimeline = this.data.timeline.timeline;
    const data = Object.keys(this.data[this.splitTimeline]).map((key) => {
      return <Channel | User>this.data[this.splitTimeline][key];
    });
    let nextColor = 0;
    for (const d of data) {
      datasets.push({
        label: d.name,
        data: [],
        borderColor: colorList[nextColor],
        fill: false,
      });
      nextColor += 1;
      if (nextColor >= colorList.length) {
        nextColor = 0;
      }
    }
    let hasStarted = false;
    let hasEnded = false;
    for (let year = years[0]; year <= lastYear; year += 1) {
      for (let month = 0; month < 12; month += 1) {
        for (let day = 1; day < Object.keys(globalTimeline[year][month]).length; day += 1) {
          if (globalTimeline[year][month][day] > 0) {
            hasStarted = true;
          }
          if (year === lastYear && month === lastMonth && day > lastDay) {
            hasEnded = true;
          }
          if (hasStarted && !hasEnded) {
            for (let i = 0; i < data.length; i += 1) {
              if (data[i].timeline.timeline[year] && data[i].timeline.timeline[year][month] && data[i].timeline.timeline[year][month][day] > 0) {
                datasets[i].data.push(data[i].timeline.timeline[year][month][day]);
              } else {
                datasets[i].data.push(null);
              }
            }
            labels.push(new Date(year, month, day).toDateString());
          }
        }
      }
    }
    this.$set(this.splitTimelineChart, 'labels', labels);
    this.$set(this.splitTimelineChart, 'datasets', datasets);
    console.log(this.splitTimelineChart);
  }

  /**
   * The user pie graph
   */
  userChart = {
    labels: [],
    datasets: [],
  };

  /**
   * Updates the user pie graph
   */
  @Watch('excludeTinyData', {
    immediate: true,
  })
  updateUserChart() {
    const labels = [];
    const colors = [];
    const data = [];
    for (const id in this.data.users) {
      const user = this.data.users[id];
      if (!this.excludeTinyData || ((user.messages / this.data.messages) * 100) > 1) {
        labels.push(user.name);
        colors.push(user.color);
        data.push(user.messages);
      }
    }
    this.$set(this.userChart, 'labels', labels);
    this.$set(this.userChart, 'datasets', [{
      data,
      backgroundColor: colors,
    }]);
  }
}
