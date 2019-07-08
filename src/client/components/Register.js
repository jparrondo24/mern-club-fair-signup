import React from 'react';

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/clubowners/register",
      data: {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
      },
      error: (result) => {
        const newFlashMessage = {
          message: result.responseJSON.error,
          isSuccess: false
        }
        this.props.handleNewFlashMessage(newFlashMessage);
      },
      success: (result) => {
        const newFlashMessage = {
          message: "Successfully signed up!",
          isSuccess: true
        }
        this.props.clearFlashMessages();
        this.props.handleNewFlashMessage(newFlashMessage);
        this.props.history.push('/profile');
      }
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Register</h1>
        <br />
        <div className="form-group">
          <label htmlFor="name">Full name</label>
          <input name="name" type="text" className="form-control" id="name" value={this.state.name} onChange={this.handleChange} placeholder="Enter name" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input name="email" type="email" className="form-control" id="email" value={this.state.email} onChange={this.handleChange} placeholder="Enter email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input name="password" type="password" className="form-control" id="password" value={this.state.password} onChange={this.handleChange} placeholder="Password" required />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
        <br />
      </form>
    );
  }
}
