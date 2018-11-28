import React, { Component } from 'react';
import './App.css';

import ChatList from './ChatList';
import Chatroom from './Chatroom';
import LoginBox from './LoginBox';

import { newNKNClient, getNKNAddr } from './nkn';
import { newBluzelleClient, writeToDB, getUserDatabaseID, getChatDatabaseID } from './bluzelle';
import { genChatID, genMessageID } from './util';

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
      let data = JSON.parse(payload);
      console.log(data);
      this.receiveMessage(data.chatID, data.message);
    });

    this.setState({
      username: username,
      chats: {},
    });
  }

  receiveMessage = (chatID, message) => {
    let chat = this.state.chats[chatID];

    if (message.contentType === 'newchat') {
      if (!chat) {
        chat = message.content;
        this.setState({
          chats: Object.assign(
            {},
            this.state.chats,
            { [chatID]: chat }
          ),
        });
      }
      return
    }

    let messageList = chat.messages || [];

    messageList = messageList.concat(message);

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
      users: otherUsers.concat(this.state.username),
    };

    writeToDB(getChatDatabaseID(chatID), 'users', JSON.stringify(chat.users));
    writeToDB(getUserDatabaseID(this.state.username), chatID, '');

    let message = {
      content: chat,
      contentType: "newchat",
    };

    otherUsers.forEach((username) => {
      this.sendMessage(username, JSON.stringify({
        chatID: chatID,
        message: message,
      }));
      writeToDB(getUserDatabaseID(username), chatID, '');
    });

    this.setState({
      chats: Object.assign({}, this.state.chats, { [chatID]: chat }),
    });

    return chatID;
  }

  createMessage = (chatID, chat, content, contentType) => {
    let message = {
      username: this.state.username,
      content: content,
      contentType: contentType,
      timestamp: new Date().getTime(),
    }

    this.receiveMessage(chatID, message);

    chat.users.forEach((username) => {
      if (username !== this.state.username) {
        this.sendMessage(username, JSON.stringify({
          chatID: chatID,
          message: message,
        }));
      }
    });

    writeToDB(getChatDatabaseID(chatID), genMessageID(), JSON.stringify(message));
  }

  enterChatroom = (chatID) => {
    this.setState({
      activeChatID: chatID,
    });
  }

  render() {
    let chatID = this.state.activeChatID;
    let chat = this.state.chats[chatID];

    return (
      <div className="App">
        {
          this.state.username ?
          (
            this.state.activeChatID ?
            <Chatroom
              chatID={this.state.activeChatID}
              myUsername={this.state.username}
              chat={chat}
              createMessage={this.createMessage.bind(this, chatID, chat)}
              leaveChatroom={() => this.enterChatroom(null)}
              />
            :
            <ChatList
              chats={this.state.chats}
              enterChatroom={this.enterChatroom}
              createChatroom={this.createChatroom}
              myUsername={this.state.username}
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
