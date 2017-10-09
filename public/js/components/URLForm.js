// Dependencies
import React from 'react';
import Cookie from 'js-cookie';

// My Components
import ShortenButton from './ShortenButton';
import LinkPreview from './LinkPreview';
import FormError from './FormError';

class URLForm extends React.Component {
  constructor() {
    super();

    this.state = {
      processing: false,
      csrfToken: '',
      formErrors: {},
      currentUrlData: {}
    };
  }

  // We need to get the current csrf token for later ajax requests
  componentWillMount() {
    const token = document.querySelector('meta[name="mystery-token"]').getAttribute('content');
    this.setState({csrfToken: token});
  }

  _handleForm(e) {
    e.preventDefault();
    const toBeShortened = this.url.value;
    this.setState({processing: true});

    if(!this._validateForm()) {
      this.setState({processing: false});
      return;
    }

    this.requestShortenedURL(toBeShortened);
  }

  _validateForm() {
    if(!this.url.value || !this.url.value.trim()) {
      this.setState({
        formErrors: {
          status: true,
          message: 'Enter a valid URL'
        }
      });
      return false;
    }
    this.setState({formErrors: {}});
    return true;
  }

  _getCSRFCookie() {
    const csrfCookie = Cookie.get('_csrf');
  }

  requestShortenedURL(url) {
    fetch('/addURL', {
      credentials: 'same-origin',
      method: 'POST',
      headers: {
        'csrf-token': this.state.csrfToken,
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({'url': url})
    });
  }

  render() {
    return (
      <div className="urlform__container">
        <form id="url-form" action="/addURL" method="POST" encType="multiform/form-data" className="url-form" onSubmit={e => this._handleForm(e)} >
          <input type="hidden" name="_csrf" value={this.state.csrfToken} />
          <div className="field text">
            <label htmlFor="url">Enter your URL</label>
            <input ref={input => this.url = input} type="text" onChange={() => this.setState({formErrors: {}})} name="url" placeholder="Enter a URL" />
            <FormError erroring={this.state.formErrors}  />
          </div>
          <div className="form__actions">
            <ShortenButton processing={this.state.processing} />
          </div>
        </form>
        <LinkPreview processing={this.state.processing} urlData={this.state.currentUrlData} />
      </div>
    );
  }
}

export default URLForm;
