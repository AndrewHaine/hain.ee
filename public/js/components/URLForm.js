// Dependencies
import React from 'react';

// My Components
import ShortenButton from './ShortenButton';

class URLForm extends React.Component {
  render() {
    return (
      <form action="/addURL" method="POST" className="url-form">
        <div className="field text">
          <label htmlFor="url">Enter your URL</label>
          <input type="text" name="url" placeholder="Enter a URL" />
        </div>
        <div className="form__actions">
          <ShortenButton />
        </div>
      </form>
    );
  }
}

export default URLForm;
