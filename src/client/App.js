import React, { Component } from 'react';
import './app.css';
import ReactImage from './react.png';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import FlashMessage from './components/FlashMessage';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flashMessages: []
    }
    this.handleNewFlashMessage = this.handleNewFlashMessage.bind(this);
  }

  handleNewFlashMessage(newFlashMessage) {
    this.setState((prevState) => {
      console.log(prevState.flashMessages);
      let newFlashMessages = prevState.flashMessages.slice(0);
      newFlashMessages.push(newFlashMessage);
      console.log(newFlashMessages);
      return {
        flashMessages: newFlashMessages
      };
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
              path="/register"
              render={(props) => <Register {...props} handleNewFlashMessage={this.handleNewFlashMessage} />}
            />
            <Route path="/login" component={Login} />
          </Switch>
        </div>
      </Router>
    );
  }
}
