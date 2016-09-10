import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';

import AppConstants from '../constants/AppConstants.js';
import AppStore from '../stores/AppStore.js';

export default class OpenProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
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
              this.props.updateAnalysis(JSON.parse(data));
              AppStore.navigate(2);
              this.setState({
                open: false,
              });
            }
          });
        }
      });
    };
  }
  render() {
    return (
      <Paper className="pages__page">
        <div className="pages__page__content pages__page__content-indented">
          <h2>Open Project</h2>
          <RaisedButton primary label="Browse" onTouchTap={this.browse} />
        </div>
        <Dialog title="Opening project file..." modal open={this.state.open}>
          <CircularProgress />
        </Dialog>
      </Paper>
    );
  }
}

OpenProject.propTypes = {
  updateAnalysis: React.PropTypes.func.isRequired,
};
