import React, { Component } from 'react';
import uuid from 'uuid/v1';
import './App.css';

import ChatList from './ChatList';
import Chatroom from './Chatroom';
import LoginBox from './LoginBox';

import { newNKNClient, getNKNAddr } from './nkn';

function genChatID() {
  return uuid()
}

function genChatName(otherUsers) {
  return otherUsers.join(', ');
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      activeChatID: null,
      chats: {},
    };
  }

  login = (username) => {
    // bluezelle: initialize client
    // bluezelle: get chat history
    // bluezelle: get friends

    this.nknClient = newNKNClient(username);
    this.nknClient.on('message', (src, payload, payloadType) => {
      let username = src.split('.')[0];
      this.receiveMessage(username, username, payload);
    });

    this.setState({
      username: username,
      chats: {},
    });
  }

  receiveMessage = (chatID, username, message) => {
    let chat = this.state.chats[chatID] || { users: [this.username, username] };
    let messageList = chat.messages || [];

    messageList = messageList.concat({
      username: username,
      content: <p>{message}</p>,
      img: "http://i.imgur.com/Tj5DGiO.jpg",
    });

    this.setState({
      chats: Object.assign(
        {},
        this.state.chats,
        { [chatID]: Object.assign({}, chat, { messages: messageList }) }
      ),
    });
  }

  sendMessage = (username, message) => {
    this.nknClient.send(getNKNAddr(username), message);
  }

  createChatroom = (otherUsers) => {
    let chatID = genChatID();
    let chat = {
      name: genChatName(otherUsers),
      users: otherUsers.concat(this.state.username),
    };

    // nkn: create chat msg
    // bluzelle: create chat

    this.setState({
      chats: Object.assign({}, this.state.chats, { [chatID]: chat }),
    });

    return chatID;
  }

  enterChatroom = (chatID) => {
    this.setState({
      activeChatID: chatID,
    });
  }

  render() {
    return (
      <div className="App">
        {
          this.state.username ?
          (
            this.state.activeChatID ?
            <Chatroom
              chatID={this.state.activeChatID}
              myUsername={this.state.username}
              chat={this.state.chats[this.state.activeChatID] || []}
              receiveMessage={this.receiveMessage}
              sendMessage={this.sendMessage}
              leaveChatroom={() => this.enterChatroom(null)}
              />
            :
            <ChatList
              chats={this.state.chats}
              enterChatroom={this.enterChatroom}
              createChatroom={this.createChatroom}
              />
          )
          :
          <LoginBox login={this.login}/>
        }
      </div>
    );
  }
}

export default App;
