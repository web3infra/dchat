import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Message from './Message.js';
import { newBluzelleClient } from './bluzelle';

import { Image } from "@noia-network/sdk-react";
import Dropzone from 'react-dropzone';
import { add } from './lib/ipfsService';
import './UploadFile.css';

export default class Chatroom extends React.Component {
  componentWillMount() {
    this.bluzelleClient = newBluzelleClient(this.props.chatID);
    this.bluzelleClient.connect();
  }

  componentWillUnmount() {
    this.bluzelleClient.disconnect();
  }

  componentDidMount() {
    this.scrollToBot();
  }

  componentDidUpdate() {
    this.scrollToBot();
  }

  scrollToBot() {
    ReactDOM.findDOMNode(this.refs.messages).scrollTop = ReactDOM.findDOMNode(this.refs.messages).scrollHeight;
  }

  submitMessage = (e) => {
    e.preventDefault();

    let { receiveMessage, sendMessage, chatID, chat, myUsername } = this.props;

    let input = ReactDOM.findDOMNode(this.refs.msg);

    if (input.value === "") {
      return;
    }

    receiveMessage(chatID, myUsername, input.value, "text");

    chat.users.forEach((username) => {
      if (username !== myUsername) {
        sendMessage(username, JSON.stringify({ content: input.value, contentType: "text" }));
      }
    });

    input.value = "";
  }

  submitImage = (src) => {
    let { receiveMessage, sendMessage, myUsername, chatID } = this.props;

    receiveMessage(chatID, myUsername, src, "image");

    chat.users.forEach((username) => {
      if (username !== myUsername) {
        sendMessage(username, JSON.stringify({ content: src, contentType: "image" }));
      }
    });
  }

  onDrop = (acceptedFiles) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = async () => {
        this.setState({ loading: true });
        const fileAsArrayBuffer = reader.result;
        const buffer = new Buffer(fileAsArrayBuffer);
        const files = [
          {
            path: file.name,
            content: buffer
          }
        ]
        const hash = await add(files);
        this.setState({ fileName: file.name, ipfsHash: hash[0].hash, uploadSuccess: true, loading: false });
        this.submitImage(`https://ipfs.infura.io/ipfs/${this.state.ipfsHash}`);
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsArrayBuffer(file);
    });
  }

  render() {
    const { chatID, chat, myUsername, leaveChatroom } = this.props;

    return (
      <div className="chatroom">
        <span className="chatroom-header">
          <span className="back" onClick={leaveChatroom}>{'< Back'}</span>
          <span className="chatname">{chat.name}</span>
          <span className="empty"></span>
        </span>
        <ul className="messages" ref="messages">
          {
            chat.messages && chat.messages.map((message, index) => (
              <Message message={message} user={myUsername} key={index} />
            ))
          }
        </ul>
        <div className="emojis">
          <Image
            src="https://ipfs.io/ipfs/QmX7cmFNPkgcr2Uy8QdvLx1dqjzqSadkhsTpnk7X2gQZJX"
            loaderComponent={<div className="loader emojis-thumbnail" />}
            onClick={() => this.submitImage("https://ipfs.io/ipfs/QmX7cmFNPkgcr2Uy8QdvLx1dqjzqSadkhsTpnk7X2gQZJX")}
          />
          <Image
            src="https://ipfs.io/ipfs/Qme46TYr2YyDNe5ZSnxEwAeEdQUsEENTBDEUhp7HwcEXiT"
            loaderComponent={<div className="loader emojis-thumbnail" />}
            onClick={() => this.submitImage("https://ipfs.io/ipfs/Qme46TYr2YyDNe5ZSnxEwAeEdQUsEENTBDEUhp7HwcEXiT")}
          />
          <Image
            src="https://ipfs.io/ipfs/QmbzA9YdJTgUTrruBtt2gXWRgfDQhJnhHwCRbbqZ4vyGVg"
            loaderComponent={<div className="loader emojis-thumbnail" />}
            onClick={() => this.submitImage("https://ipfs.io/ipfs/QmbzA9YdJTgUTrruBtt2gXWRgfDQhJnhHwCRbbqZ4vyGVg")}
          />
          <Image
            src="https://ipfs.io/ipfs/QmX7sjMLQhQ9t3afvJ36bMfugV792KxatqVwKCwEWaS9oa"
            loaderComponent={<div className="loader emojis-thumbnail" />}
            onClick={() => this.submitImage("https://ipfs.io/ipfs/QmX7sjMLQhQ9t3afvJ36bMfugV792KxatqVwKCwEWaS9oa")}
          />
          <Image
            src="https://ipfs.io/ipfs/QmYPDpA1NCNDnwnAVoH1iDvvnCyZ6qgErHyJYKfF4mDGUQ"
            loaderComponent={<div className="loader emojis-thumbnail" />}
            onClick={() => this.submitImage("https://ipfs.io/ipfs/QmYPDpA1NCNDnwnAVoH1iDvvnCyZ6qgErHyJYKfF4mDGUQ")}
          />
        </div>
        <div className="file_upload">
          <div className="uploader">
            <Dropzone onDrop={(files) => this.onDrop(files)}>
              <p>Try dropping some files here, or click to select files to upload.</p>
            </Dropzone>
          </div>
        </div>
        <form className="input" onSubmit={(e) => this.submitMessage(e)}>
          <input type="text" ref="msg" />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
