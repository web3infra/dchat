import React, { Component } from 'react';
import './App.css';

import ChatList from './ChatList';
import Chatroom from './Chatroom';
import LoginBox from './LoginBox';

import { newNKNClient, getNKNAddr } from './nkn';
import { newBluzelleClient, getAllKeys, writeToDB, getUserDatabaseID, getChatDatabaseID } from './bluzelle';
import { genChatID, genMessageID } from './util';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      activeChatID: null,
      activeChatDatabase: null,
      chats: {},
    };
  }

  loadChat = async (chatID) => {
    let chatDatabase = newBluzelleClient(getChatDatabaseID(chatID));
    await chatDatabase.connect();

    let chat = {};

    try {
      chat.users = JSON.parse(await chatDatabase.read('users'))
    } catch (e) {
      console.error(e);
    }

    let allMessageID = await chatDatabase.keys();
    let allMessageStr = await Promise.all(allMessageID.filter(
      messageID => messageID !== "users"
    ).map(
      messageID => {
        try {
          return chatDatabase.read(messageID);
        } catch (e) {
          console.error(e);
          return null;
        }
      }
    ));

    chatDatabase.disconnect();

    chat.messages = allMessageStr.filter(
      messageStr => messageStr && messageStr.length > 0
    ).map(
      messageStr => JSON.parse(messageStr)
    );

    chat.messages.sort((a, b) => (a.timestamp - b.timestamp));

    this.setState({
      chats: Object.assign({}, this.state.chats, { [chatID]: chat }),
    });
  }

  fetchHistory = async (username) => {
    let userDatabaseID = getUserDatabaseID(username);
    let allChatID = await getAllKeys(userDatabaseID);

    console.log("User database ID:", userDatabaseID);

    allChatID.forEach(this.loadChat);
  }

  componentWillUnmount() {
    if (this.state.activeChatDatabase) {
      this.state.activeChatDatabase.disconnect();
    }
  }

  login = (username) => {
    this.fetchHistory(username);

    let nknClient = newNKNClient(username);

    nknClient.on('connect', () => {
      this.nknClient = nknClient;
      if (this.messageQueue && this.messageQueue.length > 0) {
        this.messageQueue.forEach((item) => {
          this.nknClient.send(item.addrs, item.message);
        });
      }
    });

    nknClient.on('message', (src, payload, payloadType) => {
      let data = JSON.parse(payload);
      this.receiveMessage(data.chatID, data.message);
    });

    this.setState({ username: username });
  }

  receiveMessage = async (chatID, message) => {
    let chat = this.state.chats[chatID];

    if (message.contentType === 'newchat') {
      if (!chat) {
        chat = message.content;
        this.setState({
          chats: Object.assign({}, this.state.chats, { [chatID]: chat }),
        });
      }
      return;
    }

    if (!chat) {
      chat = await this.loadChat(chatID);
      if (!chat) {
        return;
      }
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

  sendMessage = (usernames, message) => {
    if (!Array.isArray(usernames)) {
      usernames = [usernames];
    }

    let nknAddrs = usernames.map(username => getNKNAddr(username));

    if (this.nknClient) {
      this.nknClient.send(nknAddrs, message);
    } else {
      this.messageQueue = this.messageQueue || [];
      this.messageQueue.push({
        addrs: nknAddrs,
        message: message,
      });
    }
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

    this.sendMessage(otherUsers, JSON.stringify({
      chatID: chatID,
      message: message,
    }));

    otherUsers.forEach((username) => {
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

    this.sendMessage(
      chat.users.filter(username => username !== this.state.username),
      JSON.stringify({
        chatID: chatID,
        message: message,
      })
    );

    if (this.state.activeChatID === chatID && this.state.activeChatDatabase) {
      this.state.activeChatDatabase.create(genMessageID(), JSON.stringify(message));
    }
  }

  enterChatroom = (chatID) => {
    if (this.state.activeChatDatabase) {
      this.state.activeChatDatabase.disconnect();
    }

    let chatDatabase = null;
    if (chatID) {
      let chatDatabaseID = getChatDatabaseID(chatID);
      chatDatabase = newBluzelleClient(chatDatabaseID);
      chatDatabase.connect();
      console.log("Chat database ID:", chatDatabaseID);
    }

    this.setState({
      activeChatID: chatID,
      activeChatDatabase: chatDatabase,
    });
  }

  render() {
    let chatID = this.state.activeChatID;
    let chat = this.state.chats[chatID];

    return (
      <div className="app">
        <div className="app-container">
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
      </div>
    );
  }
}

export default App;
