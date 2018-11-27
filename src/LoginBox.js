import React, { Component } from 'react';
import './LoginBox.css';

class LoginBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  submitLogin(e) {}

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
              <input
                type="text"
                name="username"
                className="login-input"
                placeholder="Username"/>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                className="login-input"
                placeholder="Password"/>
            </div>

            <button
              type="button"
              className="login-btn"
              onClick={this
              .submitLogin
              .bind(this)}>Login</button>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginBox;