import React from 'react';
import Router from 'next/router';
import { getInstance } from '../aplexa';
import Layout from '../components/layout';


class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.aplexa = getInstance();
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    if (!this.aplexa.isInitialized()) {
      Router.push('/login');
      return;
    }
    clearTimeout(this.nextUpdateTimeout);
    this.update();
  }

  async update() {
    const data = await this.aplexa.getAlexaNowPlaying();
    this.setState(data);
    let nextUpdateDelay;
    if (data.playing) {
      nextUpdateDelay = 5 * 1000; // data.duration - data.offset + 5000;
    } else {
      nextUpdateDelay = 60 * 1000;
    }
    this.nextUpdateTimeout = setTimeout(this.update, nextUpdateDelay);
  }

  render() {
    return (
      <Layout>
        {this.state.playing
          ? (
            <div className="now-playing">
              <h1>
                {this.state.title}
                {' '}
                <small>by</small>
                {' '}
                {this.state.artist}
              </h1>
              <h2>
                <small>From the album</small>
                {' '}
                {this.state.album}
              </h2>
              <img src={this.state.albumPic} className="album-art" alt="album art" />
              <img src={this.state.artistPic} className="artist-art" alt="artist picture" />
            </div>
          )
          : (
            <div className="not-playing">
              <h1>Not currently playing</h1>
              <button onClick={this.update}>Update</button>
            </div>
          )
        }

      </Layout>
    );
  }
}

export default Index;
