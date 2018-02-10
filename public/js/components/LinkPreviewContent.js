import React from 'react';

// Helpers
import { limit } from '../helpers/helpers';

class LinkPreviewContent extends React.Component {
  render() {

    const limitedTitle = limit(this.props.urlData.title, 50) || '';
    const limitedURL = limit(this.props.urlData.url, 30) || '';
    const backgroundImage = this.props.urlData.url ? `url('${this.props.urlData.imgSrc || '/images/h-icon.svg'}')` : '';

    return (
      <div className={this.props.urlData.url ? 'shorten-preview__content shorten-preview__content--active' : 'shorten-preview__content'}>
        <div className="shorten-preview__image" style={{backgroundImage: backgroundImage}}>
        </div>
        <div className='shorten-preview__text'>
          <div className="shorten-preview__title">{limitedTitle}</div>
          <a className="shorten-preview__link" title={this.props.urlData.title} href={this.props.urlData.url} rel="noopener" target="_blank">{limitedURL}</a>
        </div>
      </div>
    );
  }
}

export default LinkPreviewContent;
