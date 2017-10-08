import React from 'react';

class LinkPreview extends React.Component
{
  render() {
    return (
      <div className="shorten-preview">
        <div className="shorten-preview__content">
          <div className="shorten-preview__image">

          </div>
          <div className="shorten-preview__text">
            <div className="shorten-preview__title"></div>
            <a className="shorten-preview__link"></a>
          </div>
        </div>
      </div>
    );
  }
}

export default LinkPreview;
