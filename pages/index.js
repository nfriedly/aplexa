import React from 'react';
import Router from 'next/router';
import Visibility from 'document-visibility';
import Aplexa from '../lib/aplexa';
import { loadCredentials } from '../lib/credentials';
import Layout from '../components/layout';
import NowPlaying from '../components/now-playing';


class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.initialState;
    this.tick = this.tick.bind(this);
    this.update = this.update.bind(this);
    this.handleAplexaError = this.handleAplexaError.bind(this);
  }

  componentDidMount() {
    const { credentials } = this.props;
    if (credentials && credentials.password) {
      const visibility = Visibility();
      this.aplexa = new Aplexa({ poll: visibility.visible(), ...credentials });
      this.aplexa.on('song', this.update);
      this.aplexa.on('error', this.handleAplexaError);
      this.stopVisibilityObserver = visibility.onChange(this.handleVisibilityChange.bind(this));
    } else {
      Router.push('/login');
    }
  }

  componentWillUnmount() {
    if (this.aplexa) {
      this.aplexa.pause();
      this.aplexa.off('song', this.update);
      this.aplexa.off('error', this.handleAplexaError);
    }
    if (this.stopVisibilityObserver) {
      this.stopVisibilityObserver();
    }
    this.pauseTimer();
  }

  static async getInitialProps(ctx) {
    const credentials = loadCredentials(ctx);
    let initialState = { playing: false };
    if (credentials && credentials.password) {
      try {
        initialState = await new Aplexa(credentials).getAlexaNowPlaying();
      } catch (error) {
        initialState = { error: error.message || error.toString() };
        // eslint-disable-next-line no-console
        console.error('Unable to load data from plex:', error);
      }
    }
    return {
      credentials,
      initialState,
    };
  }

  handleAplexaError(error) {
    this.setState({ error });
  }

  handleVisibilityChange(visible) {
    if (visible) {
      this.aplexa.resume();
      this.resumeTimer();
    } else {
      this.aplexa.pause();
      this.pauseTimer();
    }
  }

  pauseTimer() {
    clearTimeout(this.nextTick);
  }

  resetTimer() {
    this.setState({
      lastTick: Date.now(),
    });
    this.tick();
  }

  resumeTimer() {
    this.tick();
  }

  tick() {
    clearTimeout(this.nextTick);
    const { playing } = this.state;
    if (!playing) {
      return;
    }
    this.setState((state) => {
      const now = Date.now();
      let { offset } = state;
      const { duration, lastTick } = state;
      offset = Math.min(offset + now - lastTick, duration);
      // As long as the song isn't over, schedule the next tick.
      // (Otherwise, it will reset when the next song begins)
      if (offset < duration) {
        this.nextTick = setTimeout(this.tick, 1000);
      }
      return {
        offset,
        lastTick: now,
      };
    });
  }

  update(data) {
    this.setState({
      error: null,
      ...data,
    });
    this.resetTimer();
  }

  render() {
    const {
      playing, error,
    } = this.state;
    return (
      <Layout>
        {error ? (
          <div className="alert alert-danger" role="alert" style={{ margin: '20px 0' }}>
            {error.message || error}
          </div>
        ) : null}
        {playing
          ? (
            <NowPlaying {...this.state} />
          )
          : (
            <div className="not-playing">
              <h1>Not currently playing</h1>
            </div>
          )
        }

      </Layout>
    );
  }
}

export default Index;
