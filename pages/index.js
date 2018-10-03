import React from 'react';
import Router from 'next/router';
import Aplexa from '../lib/aplexa';
import { loadCredentials } from '../lib/credentials';
import Layout from '../components/layout';
import NowPlaying from '../components/now-playing';


class Index extends React.Component {
  constructor(props) {
    super(props);
    console.log('index constructor', props)
    this.state = props.initialState;
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    console.log('index did mount', this.props)
    const { credentials } = this.props;
    if (credentials && credentials.password) {
      console.log('got creds, starting aplexa');
      this.aplexa = new Aplexa(credentials);
      this.update();
    } else {
      Router.push('/login');
    }
  }

  static async getInitialProps(ctx) {
    console.log('getinitprops')
    const credentials = loadCredentials(ctx);
    console.log('get initial props credentials', credentials)
    let initialState = {};
    if (credentials && credentials.password) {
      initialState = await new Aplexa(credentials).getAlexaNowPlaying();
    }
    return {
      credentials,
      initialState,
    };
  }

  // todo: move this logic to Aplexa class, make it trigger an event with the update
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
    const {
      playing,
    } = this.state;
    return (
      <Layout>
        {playing
          ? (
            <NowPlaying {...this.state} />
          )
          : (
            <div className="not-playing">
              <h1>Not currently playing</h1>
              <button type="button" className="btn" onClick={this.update}>🔄 Refresh</button>
            </div>
          )
        }

      </Layout>
    );
  }
}

export default Index;
