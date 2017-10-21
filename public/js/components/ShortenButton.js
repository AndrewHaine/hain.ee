import React from 'react';

class ShortenButton extends React.Component {

  constructor() {
    super();

    this.state = {
      valueCopied: false,
      valueToCopy: ''
    };
  }

  componentWillUpdate(nextProps, nextState) {

    // Set the current shortened url
    let idString = nextProps.urlData.idString;
    if(idString && idString != '') {
      nextState.valueToCopy = `${nextProps.rootURL}/${idString}`;
    }

    if(!idString) nextState.valueCopied = false;
  }

  copyToClipboard(e) {
    e.preventDefault();
    const el = document.createElement('textarea');
    el.value = this.state.valueToCopy;

    document.body.appendChild(el);

    el.focus();
    el.setSelectionRange(0, el.value.length);

    document.execCommand('copy');

    document.body.removeChild(el);

    this.setState({valueCopied: !this.state.valueCopied});
  }

  render() {
    if(this.props.processing) {
      return <button className="button__shorten button__shorten--processing">Working</button>;
    } else if (this.props.urlData.idString && this.props.urlData.idString !== '') {
      let buttonText = this.state.valueCopied ? 'Copied!' : 'Copy';
      return <button className="button__shorten button__shorten--copy" onClick={(e) => this.copyToClipboard(e)}>{buttonText}</button>;
    } else {
      return <button className="button__shorten">Shorten</button>;
    }
  }
}

export default ShortenButton;
