import React from 'react';

const Message = ({message, user}) => (
  <li className={`message ${user === message.username ? "right" : "left"}`}>
    {user !== message.username
      && <img src={message.img} alt={`${message.username}'s profile pic`} />
  }
  {message.content}
</li>
);

export default Message;
