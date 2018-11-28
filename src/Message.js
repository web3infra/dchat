import React from 'react';
import { Image } from "@noia-network/sdk-react";

const Message = ({ message, user }) => (
  <li className={`${message.contentType === "image" ? "message message-image" : "message"} ${user === message.username ? "right" : "left"}`}>
    {user !== message.username
      && <img className="avatar" src="http://i.imgur.com/Tj5DGiO.jpg" alt={`${message.username}'s profile pic`} />
    }
    {message.contentType === "image" ? <div className="emoji"><Image
      src={message.content}
      loaderComponent={<div className="loader" />}
    /></div> : <p>{message.content}</p>}
  </li>
);

export default Message;
