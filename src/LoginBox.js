import React from 'react';
import './LoginBox.css';

class LoginBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formUsername: '',
      password: ''
    };

    this.handelChange = this.handelChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
  }

  handelChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  handleLoginSubmit(e) {
    e.preventDefault();
    if (!this.state.password) {
      alert('Should put in your password')
      return
    }
    this.props.login(this.state.formUsername);
  }

  render() {
    return (
      <div className="box-container">
        <div className="inner-container">
          <div className="header">
            Login
          </div>
          <div className="box">

            <div className="input-group">
              <label htmlFor="username">Username</label>
              <div className="BNS-formbox">
                <input
                  type="text"
                  name="formUsername"
                  value={this.state.formUsername}
                  onChange={this.handelChange}
                  className="login-input fix-BNS-input"
                  placeholder="yourname">
                </input>
                <div className="BNS-option"> .eth </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handelChange}
                className="login-input"
                placeholder="Password" />
            </div>

            <button
              type="button"
              className="login-btn"
              onClick={this.handleLoginSubmit}>Login</button>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginBox;