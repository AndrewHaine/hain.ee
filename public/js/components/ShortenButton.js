import React from 'react';

class ShortenButton extends React.Component {
  render() {
    if(this.props.processing) {
      return <button className="button__shorten button__shorten--processing">Working</button>;
    } else if (this.props.urlData.url && this.props.urlData.idString !== '') {
      return <button className="button__shorten button__shorten--copy">Copy</button>;
    } else {
      return <button className="button__shorten">Shorten</button>;
    }
  }
}

export default ShortenButton;
