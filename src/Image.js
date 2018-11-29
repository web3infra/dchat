import React from 'react';
import { Image } from "@noia-network/sdk-react";

const defaultCacheLoadTimeout = 3000;

export default class CachedImage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      didTimeout: false,
    };
  }

  componentDidMount() {
    let timeout = this.props.timeout;
    if (timeout === undefined) {
      timeout = defaultCacheLoadTimeout;
    }

    setTimeout(() => {
      if (this.image && !this.image.state.base64) {
        this.setState({
          didTimeout: true,
        });
      }
    }, timeout);
  }

  render() {
    return (
      this.state.didTimeout ?
      <img
        src={this.props.src}
        onClick={this.props.onClick}
        /> :
      <Image
        src={this.props.src}
        ref={image => { this.image = image; }}
        loaderComponent={this.props.loaderComponent}
        onClick={this.props.onClick}
        />
    )
  }
}
