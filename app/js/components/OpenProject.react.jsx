import React from 'react';
import AppConstants from '../constants/AppConstants.js';
import AppStore from '../stores/AppStore.js';

export default class OpenProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
        title: 'Open a Project File',
        filters: [{
          name: 'JSON',
          extensions: ['json'],
        }],
      }, (files) => {
        if (files && files.length > 0) {
          this.setState({
            open: true,
          });
          AppConstants.fs.readFile(files[0], 'utf-8', (err, data) => {
            if (err) {
              console.error(err);
            } else {
              try {
                this.props.updateAnalysis(JSON.parse(data));
                AppStore.navigate(2);
                this.setState({
                  open: false,
                });
              } catch (e) {
                this.setState({
                  open: false,
                  message: `${e}`,
                });
                setTimeout(() => {
                  this.setState({
                    error: true,
                  });
                }, 200);
              }
            }
          });
        }
      });
    };
  }
  render() {
    return (
      <div className="mdl-card pages__page">
        <div className="pages__page__content pages__page__content-indented">
          <h2>Open Project</h2>
          <button
            className="mdl-button mdl-js-button mdl-button--raised"
            onClick={this.browse}
          >
            Browse
          </button>
        </div>
        <dialog className="mdl-dialog">
          <h4 className="mdl-dialog__title">Opening project file...</h4>
          <div className="mdl-dialog__content">
            <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate" />
          </div>
        </dialog>
        <dialog className="mdl-dialog">
          <h4 className="mdl-dialog__title">An error occurred while opening the project file</h4>
          <div className="mdl-dialog__content">
            Make sure you have selected a project file and not a takeout file.
            <br />
            <br />
            The error message is as follows:
            <br />
            <code>{this.state.message}</code>
          </div>
          <div className="mdl-dialog__actions">
            <button className="mdl-button">Dismiss</button>
          </div>
        </dialog>
      </div>
    );
  }
}

OpenProject.propTypes = {
  updateAnalysis: React.PropTypes.func.isRequired,
};
