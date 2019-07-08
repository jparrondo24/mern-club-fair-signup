import React, { Component } from 'react';
import './app.css';
import ReactImage from './react.png';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import FlashMessage from './components/FlashMessage';
import Profile from './components/Profile';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flashMessages: []
    }
    this.handleNewFlashMessage = this.handleNewFlashMessage.bind(this);
    this.clearFlashMessages = this.clearFlashMessages.bind(this);
  }

  handleNewFlashMessage(newFlashMessage) {
    this.setState((prevState) => {
      let newFlashMessages = prevState.flashMessages.slice(0);
      newFlashMessages.push(newFlashMessage);
      return {
        flashMessages: newFlashMessages
      };
    });
  }

  clearFlashMessages() {
    this.setState({
      flashMessages: []
    });
  }

  render() {
    const flashMessages = this.state.flashMessages.map((flashMessage, i) => {
      return <FlashMessage key={i} flashMessage={flashMessage} />
    });
    return(
      <Router>
        <div className="App container">
          {flashMessages}
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              exact path="/register"
              render={(props) => <Register {...props} handleNewFlashMessage={this.handleNewFlashMessage} clearFlashMessages={this.clearFlashMessages} />}
            />
            <Route
              exact path="/login"
              render={(props) => <Login {...props} handleNewFlashMessage={this.handleNewFlashMessage} clearFlashMessages={this.clearFlashMessages} />}
            />
            <Route
              exact path="/profile"
              render={(props) => <Profile {...props} handleNewFlashMessage={this.handleNewFlashMessage} clearFlashMessages={this.clearFlashMessages} />}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}
