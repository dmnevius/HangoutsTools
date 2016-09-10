import React from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import { GridList, GridTile } from 'material-ui/GridList';
import Paper from 'material-ui/Paper';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';

import AppConstants from '../constants/AppConstants';
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
      <Paper className="pages__page">
        <div className="pages__page__content">
          <Card>
            <CardMedia
              overlay={
                <CardTitle
                  title="Hangouts Tools"
                  subtitle="Tools for working with Google Hangouts"
                />
              }
            >
              {
                (() => {
                  const url = 'images/background.jpeg';
                  const img = (
                    <div
                      className={this.getImageClass(url)}
                      style={{
                        background: 'url(images/background.jpeg) no-repeat center center fixed',
                        backgroundSize: 'cover',
                        height: '250px',
                      }}
                    />
                  );
                  this.preloadImage(url);
                  return img;
                })()
              }
            </CardMedia>
            <CardText>
              <GridList>
                {AppConstants.Sections.map((object, index) => {
                  const url = `images/section-${index}.jpeg`;
                  const img = (
                    <img
                      src={url}
                      alt={`Section ${index}`}
                      className={this.getImageClass(url)}
                    />
                  );
                  this.preloadImage(url);
                  return (
                    <GridTile
                      key={index}
                      title={object}
                      actionIcon={
                        <IconButton onTouchTap={this.navigate(index)}>
                          <ArrowForward color="white" />
                        </IconButton>
                      }
                    >
                      {img}
                    </GridTile>
                  );
                })}
              </GridList>
            </CardText>
          </Card>
        </div>
      </Paper>
    );
  }
}
