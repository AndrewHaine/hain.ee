// Dependencies
import React from 'react';
import RandString from 'randomstring';
import axios from 'axios';

// My Components
import ShortenButton from './ShortenButton';
import LinkPreview from './LinkPreview';
import FormError from './FormError';

class URLForm extends React.Component {
  constructor() {
    super();

    this.state = {
      currentRequestKey: '',
      currentUrlData: {},
      csrfToken: '',
      formErrors: {},
      processing: false,
      rootURL: '',
      showPreviewBox: false
    };

    this._handleShortenedURL = this._handleShortenedURL.bind(this);
    this._handleURLMeta = this._handleURLMeta.bind(this);
  }

  // We need to get the current csrf token for later ajax requests
  componentWillMount() {
    const token = document.querySelector('meta[name="mystery-token"]').getAttribute('content');
    this.setState({csrfToken: token, rootURL: window.location.origin});

    // Set the default csrf header for all post requests
    axios.defaults.headers.post['x-csrf-token'] = token;
  }

  /**
   * Entry point - kicks off the shortening process
   * Called when the form is submitted
   */
  _handleForm(e) {
    e.preventDefault();

    let toBeShortened = this.url.value;

    // Check that a url was entered
    if(!toBeShortened) {
      return this.setState({formErrors: {status: true, message: 'Please enter a URL to shorten'}});
    }

    /*
      Kick off the ajax requests to the back end and show the preview box,
      We need to create a request key to ensure delayed requests don't override more recent data
      setState is async so the fetches are inside a callback ensuring we always have the correct request key
    */
    this.setState({processing: true, showPreviewBox: true, currentRequestKey: RandString.generate(10)}, () => {


      // Make the request to get a shortened url
      this._requestShortenedURL(toBeShortened)
        .then(this._handleShortenedURL)
        .catch(e => {
          this.setState({showPreviewBox: false, formErrors: {status: true, message: e.message}});
        });

      // Make the request to get some url data
      this._requestURLMeta(toBeShortened)
        .then(this._handleURLMeta)
        .catch(e => console.error(`There was an error processing the Metadata for this website: ${e.message}`));


    });
  }

  /**
   * Make a request to the controller for a shortened url
   * @param {String} url To be shortened
   * @return {Object} axios instance
   */
  _requestShortenedURL(url) {
    const params = { url, requestKey: this.state.currentRequestKey };
    return axios.post('/addURL', params);
  }

  /**
   * Update the state and form with data received from the controller
   * @param {Object} response from the controller
   */
  _handleShortenedURL(response) {

    // Update the state
    this.setState({
      processing: false,
      showPreviewBox: true,
      currentUrlData: Object.assign(this.state.currentUrlData, response.data)
    });

    // Dump the shortened url back into the input
    document.getElementById('url-input').value = `${this.state.rootURL}/${response.data.idString}`;

  }

  /**
   * Request some metadata from the website who's url we are shortening
   * @param {String} url to be queried
   * @return {Object} axios instance
   */
  _requestURLMeta(url) {
    const params = { url, requestKey: this.state.currentRequestKey };
    return axios.post('/getURLMeta', params);
  }

  /**
   * Update the state and form with data received from the controller
   * @param {Object} response from the controller
   */
  _handleURLMeta(response) {
    if(response.data.requestKey === this.state.currentRequestKey) {
      this.setState({currentUrlData: Object.assign(this.state.currentUrlData, response.data), showPreviewBox: !!response.data.url});
    }
  }

  /**
   * Render this component
   */
  render() {
    return (
      <div className="urlform__container">
        <form id="url-form" action="/addURL" method="POST" encType="multiform/form-data" className="url-form" onSubmit={e => this._handleForm(e)} >
          <input type="hidden" name="_csrf" value={this.state.csrfToken} />
          <div className="field text">
            <label htmlFor="url">Enter your URL</label>
            <input id='url-input' ref={input => this.url = input} type="text" onChange={() => this.setState({formErrors: {}, processing: false, showPreviewBox: false, currentUrlData: {}})} name="url" placeholder="Enter a URL" />
            <FormError erroring={this.state.formErrors}  />
          </div>
          <div className="form__actions">
            <ShortenButton processing={this.state.processing} urlData={this.state.currentUrlData} rootURL={this.state.rootURL} />
          </div>
        </form>
        <LinkPreview processing={this.state.processing} urlData={this.state.currentUrlData} processing={this.state.processing} showPreviewBox={this.state.showPreviewBox} />
      </div>
    );
  }
}

export default URLForm;
