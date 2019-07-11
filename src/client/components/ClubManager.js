import React from 'react';
import axios from 'axios';

export default class ClubManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      students: [],
      ownerHasClub: false,
      isAddingClub: false,
      isEditingName: false,
      isEditingDescription: false
    };
    this.handleAddClub = this.handleAddClub.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmitClubForm = this.handleSubmitClubForm.bind(this);
    this.handleEditFormSubmit = this.handleEditFormSubmit.bind(this);
    this.handleDeleteClub = this.handleDeleteClub.bind(this);
  }

  handleAddClub() {
    this.setState({
      isAddingClub: true
    });
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmitClubForm(event) {
    event.preventDefault();
    axios({
      method: 'POST',
      url: '/clubs',
      withCredentials: true,
      data: {
        name: this.state.name,
        description: this.state.description
      }
    }).then((response) => {
      const { data } = response;
      this.props.clearFlashMessages();
      this.props.handleNewFlashMessage({
        message: data.success,
        isSuccess: true
      });
      this.setState({
        ownerHasClub: true
      });
    }).catch((err) => {
      if (err.response) {
        const { data } = err.response;

        this.props.handleNewFlashMessage({
          message: data.error,
          isSuccess: false
        });
      }
    });
  }

  handleEditFormSubmit(event) {
    event.preventDefault();
    console.log(event.currentTarget.id);
    if (event.currentTarget.id === "name" && !this.state.isEditingName) {
      this.setState({
        isEditingName: true
      });
    } else if (event.currentTarget.id === "description" && !this.state.isEditingDescription) {
      this.setState({
        isEditingDescription: true
      });
    } else {
      const { id } = event.currentTarget;
      axios({
        method: 'PUT',
        url: '/clubs',
        data: {
          [id]: this.state[event.currentTarget.id]
        },
        withCredentials: true
      })
      .then((response) => {
        const { data } = response;
        this.props.clearFlashMessages();
        this.props.handleNewFlashMessage({
          message: data.success,
          isSuccess: true
        });
        if (id === "name") {
          this.setState({
            isEditingName: false
          });
        } else {
          this.setState({
            isEditingDescription: false
          });
        }
      })
      .catch((err) => {
        console.log(err.response);
        this.props.handleNewFlashMessage({
          message: err.response.data.error,
          isSuccess: false
        });
      });
    }
  }

  handleDeleteClub() {
    axios.delete('/clubs', { withCredentials: true })
      .then((response) => {
        const { data } = response;
        this.props.clearFlashMessages();
        this.props.handleNewFlashMessage({
          message: data.success,
          isSuccess: true
        });
        this.setState({
          name: '',
          description: '',
          students: [],
          ownerHasClub: false,
          isAddingClub: false,
          isEditingName: false,
          isEditingDescription: false
        });
      })
      .catch((err) => {
        if (err.response) {
          const { data } = err.response;
          this.props.handleNewFlashMessage({
            message: data.error,
            isSuccess: false
          });
        }
      });
  }

  componentDidUpdate(prevProps) {
    if (this.props.clubId !== prevProps.clubId) {
      axios.get('/clubs/'+ this.props.clubId, { withCredentials: true })
        .then((response) => {
          const { data } = response;
          this.setState({
            name: data.name,
            description: data.description,
            ownerHasClub: true
          });
        })
        .catch((err) => {
          if (err.status === "idNotFound") {
            this.setState({
              ownerHasClub: false
            });
          }
        });
    }
  }

  render() {
    if (this.state.ownerHasClub === null) {
      return null;
    } else if (this.state.ownerHasClub) {
      let nameAttributes = "form-control-plaintext";
      let nameButtonAttributes = "btn btn-primary";
      let nameButtonIcon = "fa fa-edit";

      let descriptionAttributes = "form-control-plaintext";
      let descriptionButtonAttributes = "btn btn-primary";
      let descriptionButtonIcon = "fa fa-edit";

      if (this.state.isEditingName) {
        nameAttributes = "form-control";
        nameButtonAttributes = "btn btn-success";
        nameButtonIcon = "fa fa-check";
      }
      if (this.state.isEditingDescription) {
        descriptionAttributes = "form-control";
        descriptionButtonAttributes = "btn btn-success";
        descriptionButtonIcon = "fa fa-check";
      }
      return (
        <div className="club-manager">
          <h1>Your Club</h1>
          <form id="name" onSubmit={this.handleEditFormSubmit}>
            <div className="form-group row">
              <label htmlFor="name" className="col-sm-2 col-form-label">Club Name</label>
              <div className="col-sm-6">
                <input name="name" readOnly={!this.state.isEditingName} className={nameAttributes} onChange={this.handleInputChange} type="text" id="name" value={this.state.name} required />
              </div>
              <div className="col-sm-4">
                <button type="submit" id="email" className={nameButtonAttributes}><i className={nameButtonIcon}></i></button>
              </div>
            </div>
          </form>
          <form id="description" onSubmit={this.handleEditFormSubmit}>
            <div className="form-group row">
              <label className="col-form-label col-sm-2" htmlFor="description">Description</label>
              <div className="col-sm-6">
                <textarea name="description" readOnly={!this.state.isEditingDescription} className={descriptionAttributes} onChange={this.handleInputChange} id="description" rows="3" value={this.state.description}/>
              </div>
              <div className="col-sm-4">
                <button type="submit" id="email" className={descriptionButtonAttributes}><i className={descriptionButtonIcon}></i></button>
              </div>
            </div>
          </form>
          <button onClick={this.handleDeleteClub} className="btn btn-danger">Delete Club <i className="fa fa-trash"></i></button>
        </div>
      );
    } else {
      let form = <button onClick={this.handleAddClub} className="btn btn-success">Add Club <i className="fa fa-plus"></i></button>;
      if (this.state.isAddingClub) {
        form = (
          <form onSubmit={this.handleSubmitClubForm}>
            <div className="form-group row">
              <label htmlFor="name" className="col-sm-2 col-form-label">Club Name</label>
              <div className="col-sm-6">
                <input name="name" className="form-control" onChange={this.handleInputChange} type="text" id="name" value={this.state.name} required />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-form-label col-sm-2" htmlFor="description">Description</label>
              <div className="col-sm-6">
                <textarea onChange={this.handleInputChange} name="description" className="form-control" id="description" rows="3" value={this.state.description}/>
              </div>
            </div>
            <button type="submit" className="btn btn-success">Add Club <i className="fa fa-check"></i></button>
          </form>
        );
      }
      return(
        <div className="club-manager">
          <h1>Your Club</h1>
          {form}
        </div>
      );
    }
  }
}
