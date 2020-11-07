import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"


import {Nav} from "./components/subcomponents"
import {Sandbox, Swap} from "./pages"

import 'semantic-ui-css/semantic.min.css'
import './App.css';


function App() {
  return (
    <Router>
    <div className="App">
      <Nav />
      <header className="App-header">
        <p>
          Welcome to Monoswap.
        </p>
        <p>
          A DEX on Flow
        </p>
      </header>
      <Switch>
        <Route path="/sandbox">
          <Sandbox />
        </Route> 
        <Route path="/">
          <Swap />
        </Route>
      </Switch>
    </div>
    </Router>
  );
}

export default App;