import React from 'react';
import axios from 'axios';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      isInEditMode: {
        name: false,
        email: false,
        password: false
      },
      oldPassword: '',
      newPassword: '',
      newPasswordCheck: ''
    }
    this.handleToggle = this.handleToggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
    this.handlePasswordToggle = this.handlePasswordToggle.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleToggle(event) {
    event.preventDefault();
    console.log(event.currentTarget.id);
    if (event.currentTarget.id === "name") {
      if (!this.state.isInEditMode.name) {
        this.setState((prevState) => {
          return {
            isInEditMode: {
              name: true,
              email: prevState.isInEditMode.email,
              password: prevState.isInEditMode.password
            }
          };
        });
      } else {
        axios({
          method: 'PUT',
          url: '/clubowners/update',
          data: {
            name: this.state.name
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
            this.setState((prevState) => {
              return {
                isInEditMode: {
                  name: false,
                  email: prevState.isInEditMode.email,
                  password: prevState.isInEditMode.password
                }
              };
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
    } else {
      if (!this.state.isInEditMode.email) {
        this.setState((prevState) => {
          return {
            isInEditMode: {
              name: prevState.isInEditMode.name,
              email: true,
              password: prevState.isInEditMode.password
            }
          };
        });
      } else {
        axios({
          method: 'PUT',
          url: '/clubowners/update',
          data: {
            email: this.state.email
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
            this.setState((prevState) => {
              return {
                isInEditMode: {
                  name: prevState.isInEditMode.name,
                  email: false,
                  password: prevState.isInEditMode.password
                }
              };
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
    }
  }

  handlePasswordToggle() {
    this.setState((prevState) => {
      return {
        isInEditMode: {
          name: prevState.isInEditMode.name,
          email: prevState.isInEditMode.email,
          password: true
        }
      };
    });
  }

  handlePasswordSubmit(event) {
    event.preventDefault();
    if (this.state.newPassword === this.state.newPasswordCheck) {
      axios({
        method: 'PUT',
        url: '/clubowners/update',
        data: {
          oldPassword: this.state.oldPassword,
          newPassword: this.state.newPassword
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
        this.setState((prevState) => {
          return {
            isInEditMode: {
              name: prevState.isInEditMode.name,
              email: prevState.isInEditMode.name,
              password: false
            }
          };
        });
      })
      .catch((err) => {
        console.log(err.response);
        this.props.handleNewFlashMessage({
          message: err.response.data.error,
          isSuccess: false
        });
      });
    } else {
      this.props.handleNewFlashMessage({
        message: "New Password fields are different",
        isSuccess: false
      });
    }
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleLogout() {
    axios.get('/clubowners/logout', { withCredentials: true })
      .then((response) => {
        const { data } = response;
        this.props.clearFlashMessages();
        this.props.handleNewFlashMessage({
          message: data.success,
          isSuccess: true
        });
        this.props.history.push('/');
      });
  }

  handleDelete() {
    axios.delete('/clubowners', { withCredentials: true })
      .then((response) => {
        const { data } = response;
        console.log(data);
        this.props.clearFlashMessages();
        this.props.handleNewFlashMessage({
          message: data.success,
          isSuccess: true
        });
        this.props.history.push('/');
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

  componentWillMount() {
    axios.get('/clubowners', { withCredentials: true })
      .then((response) => {
        const { data } = response;
        this.setState({
          name: data.name,
          email: data.email
        });
      })
      .catch((err) => {
        if (err.response) {
          const { data } = err.response;

          this.props.handleNewFlashMessage({
            message: data.error,
            isSuccess: false
          });
          this.props.history.push('/login');
        }
      });
  }

  render() {
    let nameAttributes = "form-control-plaintext";
    let emailAttributes = "form-control-plaintext";
    let nameButtonAttributes = "btn btn-primary";
    let emailButtonAttributes = "btn btn-primary";
    let nameButtonIcon = "fa fa-edit";
    let emailButtonIcon = "fa fa-edit";
    let passwordForm = (
      <div>
        <button onClick={this.handlePasswordToggle} className="btn btn-warning">Change Password <i className="fa fa-edit"></i></button>
      </div>
    );
    const { name, email, password } = this.state.isInEditMode;
    if (name) {
      nameAttributes = "form-control";
      nameButtonAttributes = "btn btn-success";
      nameButtonIcon = "fa fa-check";
    }
    if (email) {
      emailAttributes = "form-control";
      emailButtonAttributes = "btn btn-success";
      emailButtonIcon = "fa fa-check";
    }
    if (password) {
      passwordForm = (
        <form onSubmit={this.handlePasswordSubmit}>
          <div className="form-group row">
            <label htmlFor="old-password" className="col-sm-2 col-form-label">Old Password</label>
            <div className="col-sm-6">
              <input name="oldPassword" className="form-control" onChange={this.handleInputChange} type="password" id="old-password" value={this.state.oldPassword} required />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="new-password" className="col-sm-2 col-form-label">New Password</label>
            <div className="col-sm-6">
              <input name="newPassword" className="form-control" onChange={this.handleInputChange} type="password" id="new-password" value={this.state.newPassword} required />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="new-password-check" className="col-sm-2 col-form-label">New Password (re-type)</label>
            <div className="col-sm-6">
              <input name="newPasswordCheck" className="form-control" onChange={this.handleInputChange} type="password" id="new-password-check" value={this.state.newPasswordCheck} required />
            </div>
          </div>
          <button type="submit" className="btn btn-success">Update Password <i className="fa fa-check"></i></button>
        </form>
      );
    }
    return (
      <div className="profile">
        <h1>Profile</h1>
        <a onClick={this.handleLogout} href="#">Log Out</a>
        <br />
        <br />
        <form>
          <div className="form-group row">
            <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
            <div className="col-sm-6">
              <input name="name" onChange={this.handleInputChange} readOnly={!name} className={nameAttributes} type="text" id="name" value={this.state.name} required />
            </div>
            <div className="col-sm-4">
              <button id="name" className={nameButtonAttributes} onClick={this.handleToggle}><i className={nameButtonIcon}></i></button>
            </div>
          </div>
        </form>
        <form>
          <div className="form-group row">
            <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
            <div className="col-sm-6">
              <input name="email" onChange={this.handleInputChange} readOnly={!email} className={emailAttributes} type="email" id="email" value={this.state.email} required />
            </div>
            <div className="col-sm-4">
              <button id="email" className={emailButtonAttributes} onClick={this.handleToggle}><i className={emailButtonIcon}></i></button>
            </div>
          </div>
        </form>
        {passwordForm}
        <br />
        <button onClick={this.handleDelete} className="btn btn-danger">Delete Account <i className="fa fa-trash"></i></button>
      </div>
    );
  }
}
