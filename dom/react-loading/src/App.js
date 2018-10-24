import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Loading from "./page/Loading/Loading";

class App extends Component {
  render() {
    return (
      <div className="App">
          <Loading />
      </div>
    );
  }
}

export default App;
