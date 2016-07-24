import {Participant} from './participant';

export class Data {
  backgroundColors: Array<string>;
  data: any;
  hoverColors: Array<string>;
  months: Array<string>;
  constructor(data: any) {
    this.data = data;
    this.backgroundColors = [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4caf50",
      "#8bc34a",
      "#cddc39",
      "#ffeb3b",
      "#ffc107",
      "#ff9800",
      "#ff5722",
      "#795548",
      "#9e9e9e",
      "#607d8b"
    ];
    this.hoverColors = [
      "#e53935",
      "#d81b60",
      "#8e24aa",
      "#5e35b1",
      "#3949ab",
      "#1e88e5",
      "#039be5",
      "#00acc1",
      "#00897b",
      "#43a047",
      "#7cb342",
      "#c0ca33",
      "#fdd835",
      "#ffb300",
      "#fb8c00",
      "#f4511e",
      "#6d4c41",
      "#757575",
      "#546e7a"
    ];
    this.months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Object",
      "Nov",
      "Dec"
    ];
  }
  formatPieChart() {
    let output = {
      "labels": [],
      "datasets": [{
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: []
      }]
    };
    let color = 0;
    for (let participant of this.data) {
      output.labels.push(participant.name);
      output.datasets[0].data.push(participant.posts);
      output.datasets[0].backgroundColor.push(this.backgroundColors[color]);
      output.datasets[0].hoverBackgroundColor.push(this.hoverColors[color]);
      color += 1;
      if (!this.backgroundColors[color]) {
        color = 0;
      }
    }
    return output;
  }
  formatTimeline() {
    let output = {
      "labels": [],
      "datasets": [{
        label: "Messages",
        fill: true,
        backgroundColor: this.backgroundColors[9],
        data: []
      }]
    };
    for (let year in this.data) {
      for (let month = 0; month < 12; month += 1) {
        output.labels.push(`${this.months[month]}, ${year}`);
        output.datasets[0].data.push(0);
        for (let day in this.data[year][month]) {
          output.datasets[0].data[output.datasets[0].data.length - 1] += this.data[year][month][day];
        }
      }
    }
    while (output.datasets[0].data[0] === 0) {
      output.datasets[0].data.shift();
      output.labels.shift();
    }
    while (output.datasets[0].data[output.datasets[0].data.length - 1] === 0) {
      output.datasets[0].data.pop();
      output.labels.pop();
    }
    return output;
  }
  formatMultiTimeline() {
    let output = {
      "labels": [],
      "datasets": []
    };
    let minYear = new Date().getFullYear() + 1;
    let maxYear = 0;
    for (let hangout of this.data) {
      for (let year in hangout.timeline) {
        let y = Number.parseInt(year);
        if (y < minYear) {
          minYear = y;
        } else if (y > maxYear) {
          maxYear = y;
        }
      }
    }
    let color = 0;
    for (let hangout of this.data) {
      let dataset = {
        label: hangout.name,
        fill: false,
        borderColor: this.backgroundColors[color],
        backgroundColor: this.backgroundColors[color],
        data: []
      };
      color += 1;
      if (!this.backgroundColors[color]) {
        color = 0;
      }
      for (let year = minYear; year <= maxYear; year += 1) {
        for (let month = 0; month < 12; month += 1) {
          dataset.data.push(0);
          if (hangout.timeline[year]) {
            if (hangout.timeline[year][month]) {
              for (let day in hangout.timeline[year][month]) {
                dataset.data[dataset.data.length - 1] += hangout.timeline[year][month][day];
              }
            }
          }
          if (dataset.data[dataset.data.length - 1] === 0) {
            dataset.data[dataset.data.length - 1] = NaN;
          }
        }
      }
      output.datasets.push(dataset);
    }
    for (let year = minYear; year <= maxYear; year += 1) {
      for (let month = 0; month < 12; month += 1) {
        output.labels.push(`${this.months[month]}, ${year}`);
      }
    }
    return output;
  }
}
