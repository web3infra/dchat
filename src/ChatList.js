import React from 'react';

class Chat extends React.Component {
  render() {
    const { chat, onClick } = this.props;

    return (
      <li className='chat' onClick={onClick}>
        <div>{chat.name}</div>
      </li>
    )
  }
}

export default class ChatList extends React.Component {
  newChat = () => {
    let username = prompt("Username");
    let chatID = this.props.createChatroom([username]);
    this.props.enterChatroom(chatID);
  }

  render() {
    const { chats, enterChatroom } = this.props;

    let chatList = [];
    for (var key in chats) {
      if (chats.hasOwnProperty(key) && chats[key]) {
        chatList.push({
          key: key,
          chat: chats[key],
        });
      }
    }

    chatList.sort(function(a, b) {
      if (!a.chat.messages || a.chat.messages.length === 0) {
        return -1;
      }
      if (!b.chat.messages || b.chat.messages.length === 0) {
        return 1;
      }
      return a.chat.messages[a.chat.messages.length-1].time - b.chat.messages[b.chat.messages.length-1].time;
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
            chatList.map(chat => (
              <Chat
                key={chat.key}
                chat={chat}
                onClick={() => enterChatroom(chat.key)}
                />
            ))
          }
        </ul>
      </div>
    )
  }
}
