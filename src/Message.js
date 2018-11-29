import React from 'react';
import CachedImage from './Image';

const Avatar = ({ username }) => (
  <div className="avatar">
    <p className="avatar-letter">{username.charAt(0).toUpperCase() || '?'}</p>
  </div>
)

const Message = ({ message, myUsername }) => (
  <li className={`${message.contentType === "image" ? "message message-image" : "message"} ${message.username === myUsername ? "right" : "left"}`}>
    { message.username !== myUsername && <Avatar username={message.username} /> }
    {
      message.contentType === "image" ?
      <div className="emoji">
        <CachedImage
          src={message.content}
          loaderComponent={<div className="loader" />}
          />
      </div> :
      <p>{message.content}</p>
    }
  </li>
);

export default Message;
