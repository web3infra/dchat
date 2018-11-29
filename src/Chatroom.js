import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Message from './Message.js';

import { Image } from "@noia-network/sdk-react";
import Dropzone from 'react-dropzone';
import { add } from './lib/ipfsService';
import './UploadFile.css';
import { getChatName } from './util';

export default class Chatroom extends React.Component {
  componentDidMount() {
    this.scrollToBot();
  }

  componentDidUpdate() {
    this.scrollToBot();
  }

  scrollToBot() {
    ReactDOM.findDOMNode(this.refs.messages).scrollTop = ReactDOM.findDOMNode(this.refs.messages).scrollHeight;
  }

  submitText = (e) => {
    e.preventDefault();

    let input = ReactDOM.findDOMNode(this.refs.msg);

    if (input.value === "") {
      return;
    }

    this.props.createMessage(input.value, "text");

    input.value = "";
  }

  submitImage = (src) => {
    this.props.createMessage(src, "image");
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
        this.setState({ fileName: file.name, ipfsHash: hash[0].hash, uploadSuccess: true });

        // HACK: ask content to be cached and wait until cached.
        const ws = new WebSocket("wss://csl-masters.noia.network:5566");
        ws.onopen = () => {
          ws.send(JSON.stringify({
            connectionTypes: [
              "webrtc"
            ],
            src: `https://ipfs.infura.io/ipfs/${this.state.ipfsHash}`
          }))
        }
        ws.onmessage = (res) => {
          const response = JSON.parse(res.data);
          if (response.status === 200 && response.data.peers.length > 0) {
            this.setState({ loading: false });
            this.submitImage(`https://ipfs.infura.io/ipfs/${this.state.ipfsHash}`);
          } else {
            setTimeout(() => {
              ws.send(JSON.stringify({
                connectionTypes: ["webrtc"],
                src: `https://ipfs.infura.io/ipfs/${this.state.ipfsHash}`
              }))
            }, 7 * 1000)
          }
        }
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsArrayBuffer(file);
    });
  }

  render() {
    const { chat, myUsername, leaveChatroom } = this.props;

    return (
      <div className="chatroom">
        <span className="chatroom-header">
          <span className="back" onClick={leaveChatroom}>{'< Back'}</span>
          <span className="chatname">{getChatName(chat, myUsername)}</span>
          <span className="empty"></span>
        </span>
        <ul className="messages" ref="messages">
          {
            chat && chat.messages && chat.messages.map((message, index) => (
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
              {this.state != null && this.state.loading &&
                <p>Uploading file...</p>
              }
              {(this.state == null || !this.state.loading) &&
                <p>Drop file here, or click to select file to upload.</p>
              }
            </Dropzone>
          </div>
        </div>
        <form className="input" onSubmit={(e) => this.submitText(e)}>
          <input type="text" ref="msg" />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
