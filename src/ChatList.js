import React from 'react';

import { getChatName } from './util';

const Chat = ({ chat, myUsername, onClick }) => {
  let lastMessage, lastActiveTimeText, previewText;
  if (chat.messages && chat.messages.length) {
    lastMessage = chat.messages[chat.messages.length-1];

    let lastActiveTime = new Date(lastMessage.timestamp);
    if (lastActiveTime.toDateString() === new Date().toDateString()) {
      lastActiveTimeText = lastActiveTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } else {
      lastActiveTimeText = lastActiveTime.toLocaleDateString();
    }

    previewText = lastMessage.content;
    if (lastMessage.users && lastMessage.users.length > 2) {
      previewText = lastMessage.username + ': ' + previewText;
    }
  }

  return (
    <li className='chat' onClick={onClick}>
      <div className='chat-info'>
        <div className='chat-name'>
          {getChatName(chat, myUsername)}
        </div>
        <div className='chat-info-fill' />
        <div className='chat-time'>
          {lastActiveTimeText}
        </div>
      </div>
      <div className='chat-preview'>
        {previewText}
      </div>
    </li>
  )
};

export default class ChatList extends React.Component {
  newChat = async () => {
    let usernamesStr = prompt('Usernames separated by comma');
    if (!usernamesStr) {
      return
    }

    let usernames = usernamesStr.split(',').map(s => s.trim()).filter(s => s && s.length > 0);
    if (!usernames.length) {
      return;
    }

    let chatID = await this.props.createChatroom(usernames);
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
              <Chat
                key={item.chatID}
                chat={item.chat}
                myUsername={myUsername}
                onClick={() => enterChatroom(item.chatID)}
                />
            ))
          }
        </ul>
      </div>
    )
  }
}
