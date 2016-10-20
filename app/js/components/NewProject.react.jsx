import React from 'react';
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
    };
    this.closeError = () => {
      this.closeDialog('error');
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
      this.openDialog('progress');
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
          this.closeDialog('progress');
          console.log(analysis);
          this.updateAnalysis(analysis);
          AppStore.navigate(2);
        } catch (e) {
          this.closeDialog('progress');
          this.openDialog('error');
          this.setState({
            message: `${e}`,
          });
        }
      });
    };
  }
  updateAnalysis(data) {
    this.props.updateAnalysis(data);
  }
  openDialog(id) {
    document.getElementById(`${id}-dialog`).showModal();
  }
  closeDialog(id) {
    document.getElementById(`${id}-dialog`).close();
  }
  render() {
    return (
      <div className="mdl-card pages__page">
        <div className="pages__page__content pages__page__content-indented">
          <h3>{this.state.name}</h3>
          <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input
              className="mdl-textfield__input"
              placeholder="Project Name"
              id="name"
              onChange={(e) => this.setState({ name: e.target.value })}
            />
            <label className="mdl-textfield__label" htmlFor="name">Project Name</label>
          </div>
          <br />
          <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input
              className="mdl-textfield__input"
              value={this.state.file}
              placeholder="Takeout File"
              id="takeout"
              onChange={(e) => this.setState({ file: e.target.value })}
            />
            <label className="mdl-textfield__label" htmlFor="takeout">Takeout File</label>
          </div>
          <br />
          <button
            className="mdl-button mdl-js-button mdl-button--raised"
            onClick={this.browse}
          >
            Browse
          </button>
          <hr />
          <button
            className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent"
            onClick={this.analyze}
          >
            Create Project
          </button>
        </div>
        <dialog className="mdl-dialog" id="progress-dialog">
          <h4 className="mdl-dialog__title">Analyzing takeout file...</h4>
          <div className="mdl-dialog__content">
            <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate" />
          </div>
        </dialog>
        <dialog className="mdl-dialog" id="error-dialog">
          <h4 className="mdl-dialog__title">An error occured while opening the takeout file</h4>
          <div className="mdl-dialog__content">
            Make sure you have selected a takeout file and not a project file.
            <br />
            <br />
            The error message is as follows:
            <br />
            <code>{this.state.message}</code>
          </div>
          <div className="mdl-dialog__actions">
            <button className="mdl-button" onClick={this.closeError}>Dismiss</button>
          </div>
        </dialog>
      </div>
    );
  }
}

NewProject.propTypes = {
  updateAnalysis: React.PropTypes.func.isRequired,
};
