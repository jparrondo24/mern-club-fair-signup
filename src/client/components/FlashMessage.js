  import React from 'react';

export default class FlashMessage extends React.Component {
  render() {
    if (this.props.flashMessage.isSuccess === true) {
      return(
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          {this.props.flashMessage.message}
        </div>
      );
    } else if (this.props.flashMessage.isSuccess === false){
      return(
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          {this.props.flashMessage.message}
        </div>
      );
    }
    return null;
  }
}
