import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

import Message from './Message.js';

import nkn, { remoteAddr } from './nkn';

class Chatroom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chats: [{
        username: nkn.addr.split('.')[0],
        content: <p>{nkn.addr}</p>,
        img: "http://i.imgur.com/Tj5DGiO.jpg",
      }]
    };

    this.submitMessage = this.submitMessage.bind(this);

    nkn.on('message', (src, payload, payloadType) => {
      this.receiveMessage(src.split('.')[0], payload);
    });
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

    let input = ReactDOM.findDOMNode(this.refs.msg);

    if (input.value === "") {
      return;
    }

    this.receiveMessage(nkn.addr.split('.')[0], input.value)
    nkn.send(remoteAddr, input.value);
    input.value = "";
  }

  receiveMessage(username, content) {
    this.setState({
      chats: this.state.chats.concat([{
        username: username,
        content: <p>{content}</p>,
        img: "http://i.imgur.com/Tj5DGiO.jpg",
      }]),
    });
  }

  render() {
    const username = "Kevin Hsu";
    const { chats } = this.state;

    return (
      <div className="chatroom">
        <h3>D-Chat</h3>
        <ul className="chats" ref="chats">
          {
            chats.map((chat, index) => <Message chat={chat} user={username} key={index} />)
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

export default Chatroom;
