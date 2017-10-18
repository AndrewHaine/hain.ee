import React from 'react';
import {CSSTransitionGroup} from 'react-transition-group';

// Components
import LinkPreviewContent from './LinkPreviewContent';

class LinkPreview extends React.Component
{

  render() {

    const boxContainer =
      <div key={this.props.showPreviewBox} className="shorten-preview">
        <LinkPreviewContent urlData={this.props.urlData}></LinkPreviewContent>
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
        {this.props.showPreviewBox ? boxContainer : null}
      </CSSTransitionGroup>
    );
  }
}

export default LinkPreview;
