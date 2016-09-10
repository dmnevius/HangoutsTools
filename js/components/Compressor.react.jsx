import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import AppConstants from '../constants/AppConstants';
import AppStore from '../stores/AppStore';

export default class Compressor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      output: '',
      open: false,
      dialog: <div />,
      actions: <div />,
    };
    this.closeDialog = () => {
      this.setState({
        open: false,
      });
    };
    this.browseInput = () => {
      AppConstants.dialog.showOpenDialog({
        title: 'Choose an Input File',
        filters: [{
          name: 'JSON',
          extensions: ['json'],
        }],
      }, (files) => {
        if (files && files.length > 0) {
          let output = this.state.output;
          if (this.state.output.length < 1) {
            output = this.state.input;
          }
          this.setState({
            input: files[0],
            output,
          });
        }
      });
    };
    this.browseOutput = () => {
      AppConstants.dialog.showOpenDialog({
        title: 'Choose an Output File',
        filters: [{
          name: 'JSON',
          extensions: ['json'],
        }],
      }, (files) => {
        if (files && files.length > 0) {
          this.setState({
            output: files[0],
          });
        }
      });
    };
    this.compress = () => {
      this.setState({
        open: true,
        dialog: (
          <div>
            <CircularProgress />
            <br />
            <p>Please be patient while your file is compressed.</p>
          </div>
        ),
        actions: <div />,
      });
      AppStore.compress(this.state.input, this.state.output, (original, reduced) => {
        this.setState({
          dialog: (
            <div>
              Your file was reduced by {Math.round((reduced / original) * 100)}%.
              <br />
              ({Math.round(original / 1000000)}MB to {Math.round(reduced / 1000000)}MB)
            </div>
          ),
          actions: (
            <RaisedButton label="Ok" onTouchTap={this.closeDialog} />
          ),
        });
      });
    };
  }
  render() {
    return (
      <Paper className="pages__page">
        <div className="pages__page__content pages__page__content-indented">
          <h2>Compressor</h2>
          <TextField
            fullWidth
            floatingLabelText="Input File"
            onChange={(e, v) => this.setState({ input: v })}
            value={this.state.input}
          />
          <RaisedButton label="Browse" onTouchTap={this.browseInput} />
          <TextField
            fullWidth
            floatingLabelText="Output File"
            onChange={(e, v) => this.setState({ output: v })}
            value={this.state.output}
          />
          <RaisedButton label="Browse" onTouchTap={this.browseOutput} />
          <br />
          <br />
          Notice: The output file will be overwritten!
          <br />
          <br />
          <RaisedButton label="Compress" primary onTouchTap={this.compress} />
        </div>
        <Dialog
          title="Compressing..."
          modal
          open={this.state.open}
          actions={this.state.actions}
        >
          {this.state.dialog}
        </Dialog>
      </Paper>
    );
  }
}
