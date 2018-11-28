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
        <h3>D-Chat</h3>
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
