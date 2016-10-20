import React from 'react';
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
      menu: AppConstants.Sections,
      analysis: {},
    };
    this.close = () => {
      const drawer = document.getElementById('drawer');
      const overlay = document.getElementsByClassName('mdl-layout__obfuscator')[0];
      drawer.setAttribute('class', drawer.className.replace(' is-visible', ''));
      if (overlay) {
        overlay.setAttribute('class', overlay.className.replace(' is-visible', ''));
      }
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
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <header className="mdl-layout__header">
          <div className="mdl-layout__header-row">
            <span className="mdl-layout-title">Hangouts Tools</span>
            <div className="mdl-layout-spacer" />
            <nav className="mdl-navigation">
              {
                AppConstants.Sections.map((object, index) =>
                  <a
                    className="mdl-navigation__link"
                    onClick={this.navigate(index)}
                    key={index}
                  >
                    {object}
                  </a>
                )
              }
            </nav>
          </div>
        </header>
        <div className="mdl-layout__drawer" id="drawer">
          <span className="mdl-layout-title">Hangouts Tools</span>
          <nav className="mdl-navigation">
            <a className="mdl-navigation__link" onClick={this.navigate(-1)}>Home</a>
            {
              AppConstants.Sections.map((object, index) =>
                <a
                  className="mdl-navigation__link"
                  onClick={this.navigate(index)}
                  key={index}
                >
                  {object}
                </a>
              )
            }
          </nav>
        </div>
        <main className="mdl-layout__content pages" id="main-pages">
          <Home />
          <NewProject updateAnalysis={this.updateAnalysis} />
          <OpenProject updateAnalysis={this.updateAnalysis} />
          <Analysis data={this.state.analysis} />
        </main>
      </div>
    );
  }
}
