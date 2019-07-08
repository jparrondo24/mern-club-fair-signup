import React from 'react';
import axios from 'axios';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    axios.post('/clubowners/login', {
      email: this.state.email,
      password: this.state.password
    })
      .then((response) => {
        const newFlashMessage = {
          message: "Successfully signed in!",
          isSuccess: true
        }
        console.log("here1");
        this.props.clearFlashMessages();
        this.props.handleNewFlashMessage(newFlashMessage);
        this.props.history.push('/profile');
      })
      .catch((error) => {
        if (error.response) {
          const { data } = error.response;
          const newFlashMessage = {
            message: data.error,
            isSuccess: false
          }
          this.props.handleNewFlashMessage(newFlashMessage);
        }
      })
  }

  render() {
    return(
      <form onSubmit={this.handleSubmit}>
        <h1>Login</h1>
        <br />
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
