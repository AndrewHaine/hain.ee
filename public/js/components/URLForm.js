// Dependencies
import React from 'react';
import Cookie from 'js-cookie';
import RandString from 'randomstring';

// My Components
import ShortenButton from './ShortenButton';
import LinkPreview from './LinkPreview';
import FormError from './FormError';

class URLForm extends React.Component {
  constructor() {
    super();

    this.state = {
      processing: false,
      showPreviewBox: false,
      csrfToken: '',
      formErrors: {},
      currentUrlData: {},
      currentRequestKey: ''
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

    // Check that a url was entered
    if(!toBeShortened) {
      this.setState({formErrors: {status: true, message: 'Please enter a URL to shorten'}});
      return;
    }

    // Show the preview box
    this.setState({processing: true, showPreviewBox: true, currentRequestKey: RandString.generate(10)}, () => {
      // Make the request to get a shortened url
      this.requestShortenedURL(toBeShortened)
        .then(data => {
          if(data.status === 200) {
            data.json().then(body => {
              this.setState({ processing: false, showPreviewBox: true});
            });
          } else {
            data.text().then(error => {
              this.setState({processing: false, showPreviewBox: false, formErrors: {status: true, message: error}});
            });
          }
        })
        .catch(e => {
          this.setState({showPreviewBox: false, formErrors: {status: true, message: e.message}});
        });

      // Make the request to get some url data
      this.requestURLMeta(toBeShortened)
        .then(data => {
          if(data.status === 200) {
            data.json().then(body => {
              if(body.requestKey === this.state.currentRequestKey) {
                this.setState({currentUrlData: body, showPreviewBox: !!body.url});
              }
            });
          } else {
            data.text().then(error => {
              this.setState({processing: false, showPreviewBox: false});
            });
          }
        });
    });
  }

  _getCSRFCookie() {
    const csrfCookie = Cookie.get('_csrf');
  }

  requestShortenedURL(url) {
    return fetch('/addURL', {
      credentials: 'same-origin',
      method: 'POST',
      headers: {
        'csrf-token': this.state.csrfToken,
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({'url': url, requestKey: this.state.currentRequestKey})
    });
  }

  requestURLMeta(url) {
    return fetch('/getURLMeta', {
      credentials: 'same-origin',
      method: 'POST',
      headers: {
        'csrf-token': this.state.csrfToken,
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({'url': url, requestKey: this.state.currentRequestKey})
    });
  }

  render() {
    return (
      <div className="urlform__container">
        <form id="url-form" action="/addURL" method="POST" encType="multiform/form-data" className="url-form" onSubmit={e => this._handleForm(e)} >
          <input type="hidden" name="_csrf" value={this.state.csrfToken} />
          <div className="field text">
            <label htmlFor="url">Enter your URL</label>
            <input ref={input => this.url = input} type="text" onChange={() => this.setState({formErrors: {}, processing: false, showPreviewBox: false, currentUrlData: {}})} name="url" placeholder="Enter a URL" />
            <FormError erroring={this.state.formErrors}  />
          </div>
          <div className="form__actions">
            <ShortenButton processing={this.state.processing} urlData={this.state.currentUrlData} />
          </div>
        </form>
        <LinkPreview processing={this.state.processing} urlData={this.state.currentUrlData} processing={this.state.processing} showPreviewBox={this.state.showPreviewBox} />
      </div>
    );
  }
}

export default URLForm;
