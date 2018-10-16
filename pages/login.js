import React from 'react';
import Router from '../lib/router';
import { loadCredentials, storeCredentials } from '../lib/credentials';
import Layout from '../components/layout';

const DEFAULT_STATE = {
  hostname: '',
  username: '',
  password: '',
  savePassword: false,
};

class Index extends React.Component {
  constructor(props) {
    super(props);
    // todo: some way to cache the creds
    this.state = Object.assign({}, DEFAULT_STATE, props.credentials);
    if (props.credentials && props.credentials.password) {
      this.state.savePassword = true;
    }
    this.handleChange = this.handleChange.bind(this);
    this.toggleSavePassword = this.toggleSavePassword.bind(this);
    this.login = this.login.bind(this);
    this.username = React.createRef();
    this.password = React.createRef();
  }

  componentDidMount() {
    // capture auto-filled credentials from password managers
    process.nextTick(() => {
      this.setState({
        username: this.username.current.value,
        password: this.password.current.value,
      });
    });
  }

  static async getInitialProps(ctx) {
    const credentials = loadCredentials(ctx);
    return {
      credentials,
    };
  }

  login(e) {
    e.preventDefault();
    // todo: perform a request to validate the credentials before storing
    storeCredentials({}, this.state);
    Router.push('/');
  }

  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  toggleSavePassword() {
    this.setState(prevState => ({
      savePassword: !prevState.savePassword,
    }));
  }

  render() {
    const {
      error, hostname, username, password, savePassword,
    } = this.state;
    return (
      <Layout>
        <h1>Login</h1>
        {error ? <div className="error">{error}</div> : null }
        <form onSubmit={this.login}>
          <div className="form-group">
            <label htmlFor="hostname">Plex server</label>
            <input id="hostname" type="text" className="form-control" value={hostname} onChange={this.handleChange} placeholder="IP address or hostname of your plex server" />
          </div>
          <div className="form-group">
            <label htmlFor="username">Email address</label>
            <input id="username" type="text" className="form-control" value={username} onChange={this.handleChange} ref={this.username} placeholder="Plex username or email address" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" className="form-control" value={password} onChange={this.handleChange} ref={this.password} placeholder="Password" />
          </div>
          <div className="form-group form-check">
            <input type="checkbox" className="form-check-input" id="savePassword" defaultChecked={savePassword} onChange={this.toggleSavePassword} aria-describedby="password-help" />
            <label className="form-check-label" htmlFor="savePassword">Save password</label>
            <small className="form-text text-muted" id="password-help">Credentials are stored in a base64-encoded cookie (I.e. not very securely)</small>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>

      </Layout>
    );
  }
}

export default Index;
