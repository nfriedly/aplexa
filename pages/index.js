import React from 'react';
import Router from 'next/router';
import Aplexa from '../lib/aplexa';
import { loadCredentials } from '../lib/credentials';
import Layout from '../components/layout';
import NowPlaying from '../components/now-playing';


class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.initialState;
  }

  componentDidMount() {
    const { credentials } = this.props;
    if (credentials && credentials.password) {
      this.aplexa = new Aplexa({ poll: true, ...credentials });
      this.aplexa.on('song', this.setState.bind(this));
    } else {
      Router.push('/login');
    }
  }

  componentWillUnmount() {
    if (this.aplexa) {
      this.aplexa.stop();
    }
  }

  static async getInitialProps(ctx) {
    const credentials = loadCredentials(ctx);
    let initialState = { playing: false };
    console.log('gip: creds', credentials);
    if (credentials && credentials.password) {
      initialState = await new Aplexa(credentials).getAlexaNowPlaying();
    }
    console.log('gip: init state', initialState)
    return {
      credentials,
      initialState,
    };
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
            </div>
          )
        }

      </Layout>
    );
  }
}

export default Index;
