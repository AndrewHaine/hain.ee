import React from 'react';
import {CSSTransitionGroup} from 'react-transition-group';

// Helpers
import {limit} from '../helpers/helpers';

class LinkPreview extends React.Component
{
  render() {
    const limitedTitle = limit(this.props.urlData.title, 50) || '';
    const limitedURL = limit(this.props.urlData.url, 30) || '';

    const backgroundImage = `url('${this.props.urlData.imgSrc || '/images/h-icon.svg'}')`;

    const boxContainer =
      <div key={this.props.processing} className="shorten-preview">
        <div className={this.props.urlData.title ? 'shorten-preview__content shorten-preview__content--active' : 'shorten-preview__content'}>
          <div className="shorten-preview__image" style={{backgroundImage: backgroundImage}}>
          </div>
          <div className='shorten-preview__text'>
            <div className="shorten-preview__title">{limitedTitle}</div>
            <a className="shorten-preview__link" title={this.props.urlData.title} href={this.props.urlData.url} rel="noopener" target="_blank">{limitedURL}</a>
          </div>
        </div>
      </div>;

    return (
      <CSSTransitionGroup
        transitionName="preview-box-animation"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnter={true}
        transitionLeave={true}
        transitionLeaveTimeout={300}
        transitionEnterTimeout={500}>
        {this.props.processing || this.props.urlData.idString ? boxContainer : null}
      </CSSTransitionGroup>
    );
  }
}

export default LinkPreview;
