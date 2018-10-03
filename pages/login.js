import React from 'react';
import Router from 'next/router';
import { getInstance } from '../aplexa';
import Layout from '../components/layout';


class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hostname: '',
      username: '',
      password: '',
    };
    this.aplexa = getInstance();
    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
  }

  login(e) {
    e.preventDefault();
    this.aplexa.login(this.state);
    Router.push('/');
  }

  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  render() {
    const {
      error, hostname, username, password,
    } = this.state;
    return (
      <Layout>
        <h1>Login</h1>
        {error ? <div className="error">{error}</div> : null }
        <form onSubmit={this.login}>
          <div className="form-group">
            <label htmlFor="username">Plex server</label>
            <input id="hostname" type="text" className="form-control" value={hostname} onChange={this.handleChange} placeholder="IP address or hostname of your plex server" />
          </div>
          <div className="form-group">
            <label htmlFor="username">Email address</label>
            <input id="username" type="text" className="form-control" value={username} onChange={this.handleChange} placeholder="Plex username or email address" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" className="form-control" value={password} onChange={this.handleChange} placeholder="Password" />
          </div>
          <small className="form-text text-muted">We do not store your credentials, they are only used within this session to log into your plex server.</small>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>

      </Layout>
    );
  }
}

export default Index;
