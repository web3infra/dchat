import React from 'react';

import { getChatName } from './util';

export default class ChatList extends React.Component {
  newChat = () => {
    let username = prompt("Username");
    let chatID = this.props.createChatroom([username]);
    this.props.enterChatroom(chatID);
  }

  render() {
    const { chats, enterChatroom, myUsername } = this.props;

    let chatList = [];
    for (var chatID in chats) {
      if (chats.hasOwnProperty(chatID) && chats[chatID]) {
        chatList.push({
          chatID: chatID,
          chat: chats[chatID],
        });
      }
    }

    chatList.sort(function(a, b) {
      if (!a.chat.messages || a.chat.messages.length === 0) {
        return 1;
      }
      if (!b.chat.messages || b.chat.messages.length === 0) {
        return -1;
      }
      return b.chat.messages[b.chat.messages.length-1].timestamp - a.chat.messages[a.chat.messages.length-1].timestamp;
    });

    return (
      <div className="chatlist-container">
        <span className="chatlist-header">
          <span className="empty"></span>
          <span className="title">D-Chat</span>
          <span className="new" onClick={this.newChat}>New+</span>
        </span>
        <ul className="chatlist">
          {
            chatList.map(item => (
              <li className='chat' key={item.chatID} onClick={() => enterChatroom(item.chatID)}>
                <div>{getChatName(item.chat, myUsername)}</div>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}
