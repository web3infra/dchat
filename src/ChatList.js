import React from 'react';

class Chat extends React.Component {
  render() {
    const { name, onClick } = this.props;

    return (
      <li className='chat' onClick={onClick}>
        <div>{name}</div>
      </li>
    )
  }
}

export default class ChatList extends React.Component {
  newChat = () => {
    let username = prompt("Username");
    this.props.enterChatroom(username)
  }

  render() {
    const { chats, enterChatroom } = this.props;

    let chatList = [];
    for (var key in chats) {
      if (chats.hasOwnProperty(key)) {
        chatList.push({
          key: key,
          messages: chats[key],
        });
      }
    }

    chatList.sort(function(a, b) {
      if (!a.messages || a.messages.length === 0) {
        return -1;
      }
      if (!b.messages || b.messages.length === 0) {
        return 1;
      }
      return a.messages[a.messages.length-1].time - b.messages[b.messages.length-1].time;
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
                name={chat.key}
                key={chat.key}
                onClick={() => enterChatroom(chat.key)}
                />
            ))
          }
        </ul>
      </div>
    )
  }
}
