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
      "#d32f2f",
      "#c2185b",
      "#7b1fa2",
      "#512da8",
      "#303f9f",
      "#1976d2",
      "#0288d1",
      "#0097a7",
      "#00796b",
      "#388e3c",
      "#689f38",
      "#afb42b",
      "#fbc02d",
      "#ffa000",
      "#f57c00",
      "#e64a19",
      "#5d4037",
      "#616161",
      "#455a64"
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
      "Oct",
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
