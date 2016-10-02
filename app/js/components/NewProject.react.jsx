import React from 'react';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import AppConstants from '../constants/AppConstants';
import AppStore from '../stores/AppStore';

class Hangout {
  constructor(name) {
    this.name = name || '';
    this.people = {};
    this.messages = 0;
    this.timeline = {};
  }
}

class Person {
  constructor(name) {
    this.name = name || 'Unknown Person';
    this.messages = 0;
  }
}

export default class NewProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'New Project',
      file: '',
      open: false,
      error: false,
    };
    this.closeError = () => {
      this.setState({
        error: false,
      });
    };
    this.browse = () => {
      AppConstants.dialog.showOpenDialog({
        title: 'Open a Takeout File',
        filters: [{
          name: 'JSON',
          extensions: ['json'],
        }],
      }, (files) => {
        if (files && files.length > 0) {
          this.setState({
            file: files[0],
          });
        }
      });
    };
    this.analyze = () => {
      this.setState({
        open: true,
      });
      const stream = AppConstants.fs.createReadStream(this.state.file);
      let data = '';
      stream.setEncoding('utf-8');
      stream.on('data', (chunk) => {
        const shrunk = chunk.replace(/[\n\t\r]/g, '')
        .replace(/\s*("[^"]*")\s?:\s*/g, '$1:')
        .replace(/(\S)\s*([\}\]])/g, '$1$2');
        data += shrunk;
      });
      stream.on('end', () => {
        try {
          data = JSON.parse(data);
          const analysis = {
            hangouts: {},
            people: {},
            me: {},
            name: this.state.name,
          };
          for (const hangout of data.conversation_state) {
            analysis.hangouts[hangout.conversation_id.id] =
              new Hangout(hangout.conversation_state.conversation.name);
            if (typeof analysis.me.id !== 'string') {
              analysis.me.id = hangout
                .conversation_state
                .conversation
                .self_conversation_state
                .self_read_state.participant_id
                .gaia_id;
            }
            const active = analysis.hangouts[hangout.conversation_id.id];
            for (const participant of hangout.conversation_state.conversation.participant_data) {
              active.people[participant.id.gaia_id] = new Person(participant.fallback_name);
              if (!analysis.people[participant.id.gaia_id]) {
                analysis.people[participant.id.gaia_id] = new Person(participant.fallback_name);
              }
              if (
                analysis.people[participant.id.gaia_id].name === 'Unknown Person'
                && participant.fallback_name) {
                analysis.people[participant.id.gaia_id].name = participant.fallback_name;
              }
              if (!analysis.me.name && participant.id.gaia_id === analysis.me.id) {
                analysis.me.name = participant.fallback_name;
              }
            }
            for (const event of hangout.conversation_state.event) {
              if (!active.people[event.sender_id.gaia_id]) {
                if (analysis.people[event.sender_id.gaia_id]) {
                  active.people[event.sender_id.gaia_id] =
                    new Person(analysis.people[event.sender_id.gaia_id].name);
                } else {
                  active.people[event.sender_id.gaia_id] = new Person();
                }
              }
              if (!analysis.people[event.sender_id.gaia_id]) {
                analysis.people[event.sender_id.gaia_id] =
                  analysis.people[event.sender_id.gaia_id]
                  || new Person(active.people[event.sender_id.gaia_id].name);
              }
              active.messages += 1;
              active.people[event.sender_id.gaia_id].messages += 1;
              analysis.people[event.sender_id.gaia_id].messages += 1;
              const date = new Date(event.timestamp / 1000);
              const year = date.getFullYear();
              const month = date.getMonth();
              active.timeline[year] = active.timeline[year] || {};
              active.timeline[year][month] = active.timeline[year][month] || 0;
              active.timeline[year][month] += 1;
            }
          }
          this.setState({
            open: false,
          });
          console.log(analysis);
          this.updateAnalysis(analysis);
          AppStore.navigate(2);
        } catch (e) {
          this.setState({
            open: false,
            error: true,
            message: `${e}`,
          });
        }
      });
    };
  }
  updateAnalysis(data) {
    this.props.updateAnalysis(data);
  }
  render() {
    return (
      <Paper className="pages__page">
        <div className="pages__page__content pages__page__content-indented">
          <h2>{this.state.name}</h2>
          <TextField
            fullWidth
            floatingLabelText="Project Name"
            onChange={(e, v) => this.setState({ name: v })}
            value={this.state.name}
          />
          <TextField
            fullWidth
            floatingLabelText="Takeout File"
            onChange={(e, v) => this.setState({ file: v })}
            value={this.state.file}
          />
          <RaisedButton label="Browse" onTouchTap={this.browse} />
          <hr />
          <RaisedButton label="Create Project" primary onTouchTap={this.analyze} />
        </div>
        <Dialog title="Analyzing takeout file..." modal open={this.state.open}>
          <CircularProgress />
        </Dialog>
        <Dialog
          title="An error occured while opening the takeout file"
          open={this.state.error}
          actions={[
            <FlatButton label="Dismiss" onTouchTap={this.closeError} />,
          ]}
        >
          Make sure you have selected a takeout file and not a project file.
          <br />
          <br />
          The error message is as follows:
          <br />
          <code>{this.state.message}</code>
        </Dialog>
      </Paper>
    );
  }
}

NewProject.propTypes = {
  updateAnalysis: React.PropTypes.func.isRequired,
};
