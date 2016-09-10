import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { Toolbar, ToolbarTitle } from 'material-ui/Toolbar';

import Home from './Home.react';
import NewProject from './NewProject.react';
import OpenProject from './OpenProject.react';
import Analysis from './Analysis.react';
import AppConstants from '../constants/AppConstants';
import AppStore from '../stores/AppStore';

export default class HangoutsTools extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      menu: AppConstants.Sections,
      analysis: {},
    };
    this.open = () => {
      this.setState({
        open: true,
      });
    };
    this.close = () => {
      this.setState({
        open: false,
      });
    };
    this.updateAnalysis = (data) => {
      this.setState({
        analysis: data,
      });
    };
  }
  componentDidMount() {
    this.navigate(-1)();
  }
  navigate(page) {
    return () => {
      this.close();
      AppStore.navigate(page);
    };
  }
  render() {
    return (
      <div>
        <AppBar
          title="Hangouts Tools"
          onLeftIconButtonTouchTap={this.open}
          iconElementRight={
            <IconMenu
              iconButtonElement={
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              }
            >
            {this.state.menu.map((object, index) =>
              <MenuItem onTouchTap={this.navigate(index)} key={index}>{object}</MenuItem>
            )}
            </IconMenu>
          }
        />
        <Drawer docked={false} open={this.state.open} onRequestChange={() => this.close()}>
          <Toolbar style={{ height: '64px' }}>
            <ToolbarTitle text="Menu" style={{ lineHeight: '64px' }} />
          </Toolbar>
          <MenuItem onTouchTap={this.navigate(-1)}>Home</MenuItem>
          {AppConstants.Sections.map((object, index) =>
            <MenuItem onTouchTap={this.navigate(index)} key={index}>{object}</MenuItem>
          )}
        </Drawer>
        <div className="pages" id="main-pages">
          <Home />
          <NewProject updateAnalysis={this.updateAnalysis} />
          <OpenProject />
          <Analysis data={this.state.analysis} />
        </div>
      </div>
    );
  }
}
