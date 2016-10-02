import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
  blueGrey100,
  blueGrey400,
  blueGrey500,
  green500,
  green700,
  cyan500 } from 'material-ui/styles/colors';

import HangoutsTools from './components/HangoutsTools.react';

injectTapEventPlugin();

const theme = getMuiTheme({
  palette: {
    primary1Color: green500,
    primary2Color: green700,
    primary3Color: blueGrey400,
    accent1Color: cyan500,
    accent2Color: blueGrey100,
    accent3Color: blueGrey500,
  },
});

ReactDOM.render(
  <MuiThemeProvider muiTheme={theme}>
    <HangoutsTools />
  </MuiThemeProvider>,
  document.getElementById('app')
);
