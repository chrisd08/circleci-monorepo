import React, { Component } from "react";
import "./App.css";
import logo from "./logo.svg";
import { DISPLAY_ERROR_CODE } from "@codeponder/common";
class App extends Component {
  render() {
    console.log(DISPLAY_ERROR_CODE);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React!!
          </a>
        </header>
      </div>
    );
  }
}

export default App;
