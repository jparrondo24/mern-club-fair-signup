import React from 'react';

export default class FlashMessage extends React.Component {
  render() {
    if (!this.props.flashMessage) {
      return null;
    }
    const alertClass = (this.props.flashMessage.isSuccess) ? "alert-success" : "alert-danger";
    const allClasses = "alert alert-dismissible fade show " + alertClass;
    return(
      <div className="flash-message">
        <div className={allClasses} role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          {this.props.flashMessage.message}
        </div>
      </div>
    );
  }
}
