import Chart from 'chart.js';
import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import { Card, CardHeader, CardActions } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import { Tabs, Tab } from 'material-ui/Tabs';

import AppConstants from '../constants/AppConstants';

class Dataset {
  constructor(label, color) {
    this.label = label;
    this.fill = false;
    this.backgroundColor = color;
    this.borderColor = color;
    this.data = [];
  }
}

class Person {
  constructor(name, messages, id) {
    this.name = name;
    this.messages = messages;
    this.id = id;
  }
}

export default class Analysis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      totalMessages: 0,
      people: [],
      hangouts: [],
      tab: 'Overview',
    };
    this.global = () => {
      this.compute(this.originalData);
    };
    this.handleChange = (tab) => {
      this.setState({
        tab,
      });
    };
  }
  componentDidMount() {
    this.overviewChart = new Chart(this.overview.getContext('2d'), {
      type: 'line',
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        responsive: true,
        legend: false,
      },
    });
    this.participantChart = new Chart(this.people.getContext('2d'), {
      type: 'pie',
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        responsive: true,
        legend: false,
      },
    });
  }
  componentWillReceiveProps(newProps) {
    this.originalData = newProps.data;
    this.compute(newProps.data);
  }
  compute(data) {
    let totalMessages = 0;
    let totalParticipants = 0;
    let hangouts = [];
    const people = [];
    const overviewData = {
      labels: [],
      datasets: [],
    };
    const participantData = {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [],
      }],
    };
    const timeline = {
      first: new Date().getFullYear() + 1,
      last: 0,
    };
    const months = [
      'Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep',
      'Oct', 'Nov', 'Dec'];
    if (typeof data.hangouts === 'object') {
      const hangoutsList = Object.getOwnPropertyNames(data.hangouts);
      let color = 0;
      for (let hangout of hangoutsList) {
        hangout = data.hangouts[hangout];
        const participants = Object.getOwnPropertyNames(hangout.people);
        if (hangout.name === '') {
          if (participants.length === 2) {
            let other = '';
            if (data.me.id === participants[0]) {
              other = participants[1];
            } else {
              other = participants[0];
            }
            hangout.name = `Hangout with ${data.people[other].name}`;
          } else {
            hangout.name = 'Unnamed Hangout';
          }
        }
        hangouts.push(hangout);
        totalMessages += hangout.messages;
        const years = Object.getOwnPropertyNames(hangout.timeline);
        if (years[0] < timeline.first) {
          timeline.first = Number(years[0]);
        }
        if (years[years.length - 1] > timeline.last) {
          timeline.last = Number(years[years.length - 1]);
        }
        overviewData.datasets.push(new Dataset(hangout.name, AppConstants.Colors[color]));
        color += 1;
        if (color >= AppConstants.Colors.length) {
          color = 0;
        }
      }
      let currentYear = timeline.first;
      while (currentYear <= timeline.last) {
        let currentMonth = 0;
        while (currentMonth < 12) {
          overviewData.labels.push(`${months[currentMonth]} ${currentYear}`);
          let i = 0;
          while (i < hangoutsList.length) {
            if (data.hangouts[hangoutsList[i]].timeline[currentYear] &&
              data.hangouts[hangoutsList[i]].timeline[currentYear][currentMonth]) {
              overviewData.datasets[i].data.push(
                data.hangouts[hangoutsList[i]].timeline[currentYear][currentMonth]);
            } else {
              overviewData.datasets[i].data.push(null);
            }
            i += 1;
          }
          currentMonth += 1;
        }
        currentYear += 1;
      }
    }
    if (typeof data.people === 'object') {
      let color = 0;
      for (const participant of Object.getOwnPropertyNames(data.people)) {
        const person = data.people[participant];
        totalParticipants += 1;
        people.push(new Person(person.name, person.messages, participant));
        participantData.labels.push(person.name);
        participantData.datasets[0].data.push(person.messages);
        participantData.datasets[0].backgroundColor.push(AppConstants.Colors[color]);
        color += 1;
        if (color >= AppConstants.Colors.length) {
          color = 0;
        }
      }
    }
    if (typeof data.timeline === 'object') {
      overviewData.datasets.push(
        new Dataset(
          data.name,
          AppConstants.Colors[Math.floor(Math.random() * AppConstants.Colors.length) + 1]
        )
      );
      const years = Object.getOwnPropertyNames(data.timeline).sort();
      let currentYear = Number(years[0]);
      while (currentYear <= Number(years[years.length - 1])) {
        let month = 0;
        while (month < 12) {
          overviewData.labels.push(`${months[month]} ${currentYear}`);
          if (data.timeline[currentYear] && data.timeline[currentYear][month]) {
            overviewData.datasets[0].data.push(data.timeline[currentYear][month]);
          } else {
            overviewData.datasets[0].data.push(null);
          }
          month += 1;
        }
        currentYear += 1;
      }
    }
    if (data.messages) {
      totalMessages = data.messages;
    }
    if (!data.hangouts) {
      hangouts = this.state.hangouts;
    }
    this.setState({
      data,
      totalMessages,
      totalParticipants,
      people,
      hangouts,
      tab: 'Overview',
    });
    this.overviewChart.data.labels = overviewData.labels;
    this.overviewChart.data.datasets = overviewData.datasets;
    this.overviewChart.update();
    this.participantChart.data.labels = participantData.labels;
    this.participantChart.data.datasets = participantData.datasets;
    this.participantChart.update();
  }
  detail(index) {
    return () => {
      const data = this.state.hangouts[index];
      data.me = this.state.data.me;
      this.compute(data);
    };
  }
  render() {
    return (
      <Paper className="pages__page">
        <div className="pages__page__content pages__page__content-indented">
          <Tabs value={this.state.tab} onChange={this.handleChange}>
            <Tab label="Overview" value="Overview">
              <h2>{this.state.data.name}</h2>
              <h3>Total Messages: {this.state.totalMessages}</h3>
              <canvas ref={(e) => { this.overview = e; }} />
            </Tab>
            <Tab label="People" value="People">
              <h3>Total participants: {this.state.totalParticipants}</h3>
              <canvas ref={(e) => { this.people = e; }} />
              {this.state.people.map((object, index) =>
                (
                <Card key={index} title={object.id}>
                  <CardHeader
                    title={object.name}
                    subtitle={object.messages}
                  />
                </Card>
                )
              )}
            </Tab>
            <Tab label="Hangouts" value="Hangouts">
              <FlatButton label="Global Data" secondary onTouchTap={this.global} />
              {
                this.state.hangouts.map((object, index) =>
                  (
                  <Card key={index}>
                    <CardHeader
                      title={object.name}
                      subtitle={
                        `${Object.getOwnPropertyNames(object.people).length} people, ` +
                        `${object.messages} messages`
                      }
                    />
                    <CardActions>
                      <FlatButton label="Details" primary onTouchTap={this.detail(index)} />
                    </CardActions>
                  </Card>
                  )
              )}
            </Tab>
          </Tabs>
        </div>
      </Paper>
    );
  }
}

Analysis.propTypes = {
  data: React.PropTypes.object,
};
