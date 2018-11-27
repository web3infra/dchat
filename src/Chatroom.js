import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

import Message from './Message.js';

export default class Chatroom extends React.Component {
  constructor(props) {
    super(props);
    this.submitMessage = this.submitMessage.bind(this);
  }

  componentDidMount() {
    this.scrollToBot();
  }

  componentDidUpdate() {
    this.scrollToBot();
  }

  scrollToBot() {
    ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(this.refs.chats).scrollHeight;
  }

  submitMessage(e) {
    e.preventDefault();

    let { receiveMessage, sendMessage, myUsername, friendUsername } = this.props;

    let input = ReactDOM.findDOMNode(this.refs.msg);

    if (input.value === "") {
      return;
    }

    receiveMessage(friendUsername, myUsername, input.value);

    sendMessage(friendUsername, input.value)

    input.value = "";
  }

  render() {
    const { messages, myUsername, friendUsername } = this.props;

    return (
      <div className="chatroom">
        <h3>{friendUsername}</h3>
        <ul className="chats" ref="chats">
          {
            messages.map((message, index) => (
              <Message chat={message} user={myUsername} key={index} />
            ))
          }
        </ul>
        <form className="input" onSubmit={(e) => this.submitMessage(e)}>
          <input type="text" ref="msg" />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
