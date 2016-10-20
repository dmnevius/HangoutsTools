import React from 'react';
import AppStore from '../stores/AppStore';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urls: [],
    };
    this.images = [];
  }
  componentDidMount() {
    const next = (index) => {
      if (index < this.images.length) {
        this.loadImage(this.images[index], () => {
          next(index + 1);
        });
      }
    };
    next(0);
  }
  getImageClass(url) {
    if (this.state.urls.indexOf(url) > -1) {
      return 'image';
    }
    return 'image image-loading';
  }
  navigate(page) {
    return () => {
      AppStore.navigate(page);
    };
  }
  preloadImage(url) {
    if (this.images.indexOf(url) < 0) {
      this.images.push(url);
    }
  }
  loadImage(url, callback) {
    const image = document.createElement('img');
    image.src = url;
    image.addEventListener('load', () => {
      const urls = this.state.urls;
      urls.push(url);
      this.setState({
        urls,
      });
      callback();
    });
  }
  render() {
    return (
      <div className="mdl-card pages__page">
        <div className="pages__page__content">
          <div className="mdl-card mdl-shadow--2dp">
            <div
              className="mdl-card__title"
              style={{
                background: 'url(images/background.jpeg) no-repeat center center fixed',
              }}
            >
              <h2 className="mdl-card__title-text white">Hangouts Tools</h2>
            </div>
            <div className="mdl-card__supporting-text">
              <h4>New Project</h4>
              <button
                className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                onClick={this.navigate(0)}
              >
                Go
              </button>
              <br />
              <h4>Open Project</h4>
              <button
                className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                onClick={this.navigate(1)}
              >
                Go
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
