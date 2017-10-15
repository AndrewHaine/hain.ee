import React from 'react';
import {CSSTransitionGroup} from 'react-transition-group';

class LinkPreview extends React.Component
{
  render() {
    const boxContainer =
      <div key={this.props.processing} className="shorten-preview">
        <div className="shorten-preview__content">
          <div className="shorten-preview__image">

          </div>
          <div className={this.props.urlData.title ? 'shorten-preview__text shorten-preview__text--active' : 'shorten-preview__text'}>
            <div className="shorten-preview__title">{this.props.urlData.title}</div>
            <a className="shorten-preview__link" title={this.props.urlData.title} href={this.props.urlData.url} rel="noopener" target="_blank">{this.props.urlData.url}</a>
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
        {this.props.processing ? boxContainer : null}
      </CSSTransitionGroup>
    );
  }
}

export default LinkPreview;
