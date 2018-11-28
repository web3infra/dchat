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



  getHistoricalChatRooms = async () =>
  {
      await this.bluzelleChatHistoryConnection.connect();

//      await this.bluzelleChatHistoryConnection.create('san francisco2', 'california2');

//      console.log(await this.bluzelleChatHistoryConnection.read('san francisco2'));

      this.historicalChatRoomKeysArray = (await this.bluzelleChatHistoryConnection.keys());

//    window.keys = (await this.bluzelleChatHistoryConnection.read('san francisco2'));

      //this.bluzelleChatHistoryConnection.bluzelle.keys().then(foo2 => { foo = foo2 }, error => { });

      await this.bluzelleChatHistoryConnection.disconnect();
  };



  getHistoricalChatMessagesFromRooms = async () =>
  {
    this.historicalChatRoomKeysArray.forEach(async function(strCurrentChatRoomId)
    {
        var strHistoricalChatRoomMessagesUUID = 'dchat_messages_history_' + strCurrentChatRoomId;

        console.log("Getting chat messages from room: " + strCurrentChatRoomId + " from namespace: " + strHistoricalChatRoomMessagesUUID);

        var bluzelleChatMessagesHistoryConnection = newBluzelleClient(strHistoricalChatRoomMessagesUUID);  

        await bluzelleChatMessagesHistoryConnection.connect();

        var arrayMembers = JSON.parse(await bluzelleChatMessagesHistoryConnection.read('users'));

        arrayMembers.forEach(function(strMember)
        {
            console.log("Found member: " + strMember + " for room: " + strCurrentChatRoomId)
        })

        var historicalChatMessagesKeysArray = (await bluzelleChatMessagesHistoryConnection.keys());

        historicalChatMessagesKeysArray.forEach(async function(strCurrentChatMessageKey)
        {
            // Ignore the "members" key as it is not an actual message

            if (strCurrentChatMessageKey != "users")
            {
                console.log("Getting chat message data for message with id: " + strCurrentChatMessageKey);

                var objectCurrentChatMessage = JSON.parse(await bluzelleChatMessagesHistoryConnection.read(strCurrentChatMessageKey));

                console.log("Message with id: " + strCurrentChatMessageKey + " has value: " + objectCurrentChatMessage.content + " and was sent by username: " + objectCurrentChatMessage.username + " with content type: " + objectCurrentChatMessage.contentType)
            }
        });
    });
  }



  login = async (username) => {

    //////////////////////////////////
    // bluezelle: initialize client //
    //////////////////////////////////

    this.strHistoricalChatRoomsUUID = 'dchat_history_' + username;

    console.log("Connecting to the following namespace on Bluzelle to get historical chat room GUIDS: " + this.strHistoricalChatRoomsUUID)

    this.bluzelleChatHistoryConnection = new BluzelleClient(
        'ws://test.network.bluzelle.com:51010',

        // This UUID identifies your database and
        // may be changed.
        //
        // Use a service like https://www.uuidgenerator.net to generate a new one

        this.strHistoricalChatRoomsUUID
    );

    await this.getHistoricalChatRooms()

    /////////////////////////////////
    // bluezelle: get chat history //
    /////////////////////////////////

    this.getHistoricalChatMessagesFromRooms()

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
