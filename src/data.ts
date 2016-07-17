import {Participant} from './participant';

export class Data {
  backgroundColors: Array<string>;
  data: any;
  hoverColors: Array<string>;
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
      "#b71c1c",
      "#880e4f",
      "#4a148c",
      "#311b92",
      "#1a237e",
      "#0d47a1",
      "#01579b",
      "#006064",
      "#004d40",
      "#1b5e20",
      "#33691e",
      "#827717",
      "#f57f17",
      "#ff6f00",
      "#e65100",
      "#bf360c",
      "#3e2723",
      "#212121",
      "#263238"
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
    let months = [
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
    ]
    for (let year in this.data) {
      for (let month = 0; month < 12; month += 1) {
        output.labels.push(`${months[month]}, ${year}`);
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
}
