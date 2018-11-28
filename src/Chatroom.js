import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Message from './Message.js';
import { newBluzelleClient } from './bluzelle';

export default class Chatroom extends React.Component {
  componentWillMount() {
    this.bluzelleClient = newBluzelleClient(this.props.chatID);
    this.bluzelleClient.connect();
  }

  componentWillUnmount() {
    this.bluzelleClient.disconnect();
  }

  componentDidMount() {
    this.scrollToBot();
  }

  componentDidUpdate() {
    this.scrollToBot();
  }

  scrollToBot() {
    ReactDOM.findDOMNode(this.refs.messages).scrollTop = ReactDOM.findDOMNode(this.refs.messages).scrollHeight;
  }

  submitMessage = (e) => {
    e.preventDefault();

    let { receiveMessage, sendMessage, chatID, chat, myUsername } = this.props;

    let input = ReactDOM.findDOMNode(this.refs.msg);

    if (input.value === "") {
      return;
    }

    receiveMessage(chatID, myUsername, input.value);

    chat.users.forEach((username) => {
      if (username !== myUsername) {
        sendMessage(username, input.value);
      }
    });

    input.value = "";
  }

  render() {
    const { chatID, chat, myUsername, leaveChatroom } = this.props;

    return (
      <div className="chatroom">
        <span className="chatroom-header">
          <span className="back" onClick={leaveChatroom}>{'< Back'}</span>
          <span className="chatname">{chat.name}</span>
          <span className="empty"></span>
        </span>
        <ul className="messages" ref="messages">
          {
            chat.messages && chat.messages.map((message, index) => (
              <Message message={message} user={myUsername} key={index} />
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
