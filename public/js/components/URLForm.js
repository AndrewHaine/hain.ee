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

    this._handleForm = this._handleForm.bind(this);
  }

  // We need to get the current csrf token for later ajax requests
  componentWillMount() {
    const token = document.querySelector('meta[name="mystery-token"]').getAttribute('content');
    this.setState({csrfToken: token});
  }

  _handleForm(e) {
    e.preventDefault();
    let toBeShortened = this.url.value;
    this.setState({processing: true});

    if(!this._validateForm()) {
      this.setState({processing: false});
      return;
    }

    toBeShortened = this._validateForm();

    this.requestShortenedURL(toBeShortened)
      .then(data => {
        if(data.status !== 200) {
          data.text().then(error => {
            this.setState({processing: false, formErrors: {status: true, message: error}});
          });
        } else {
          data.json().then(body => {
            console.log(body);
            this.setState({currentUrlData: body});
          });
        }
      })
      .catch(e => {
        this.setState({formErrors: {status: true, message: e.message}});
      });
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

    const validURL = this._validateURL(this.url.value);

    if(!validURL) {
      this.setState({
        formErrors: {
          status: true,
          message: 'Enter a valid URL'
        }
      });
      return false;
    }

    this.setState({formErrors: {}});
    return validURL;
  }

  _validateURL(url) {
    let newRL = url;
    if(!newRL.match(/^http(s?):\/\//)) {
      newRL = `http://${newRL}`;
    }

    return newRL;
  }

  _getCSRFCookie() {
    const csrfCookie = Cookie.get('_csrf');
  }

  requestShortenedURL(url) {
    return fetch('/addURL', {
      credentials: 'same-origin',
      method: 'POST',
      headers: {
        'set-cookie': Cookie.get('_csrf'),
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
            <input ref={input => this.url = input} type="text" onChange={() => this.setState({formErrors: {}, processing: false, currentUrlData: {}})} name="url" placeholder="Enter a URL" />
            <FormError erroring={this.state.formErrors}  />
          </div>
          <div className="form__actions">
            <ShortenButton processing={this.state.processing} />
          </div>
        </form>
        <LinkPreview processing={this.state.processing} urlData={this.state.currentUrlData} processing={this.state.processing} />
      </div>
    );
  }
}

export default URLForm;
