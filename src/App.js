import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"

import {Nav} from "./widgets"
import {Sandbox, Swap, Install} from "./pages"

import {Container} from "./components/styled"

import 'semantic-ui-css/semantic.min.css'
import './App.css';


function App() {
  return (
    <Router>
    <Container root centered className="App">
      <Nav />
      <header className="App-header">
      </header>
      <Switch>
        <Route path="/sandbox">
          <Sandbox />
        </Route> 
        <Route path="/install">
          <Install />
        </Route> 
        <Route path="/">
          <Swap />
        </Route>
      </Switch>
      <Container classNme="footer">Footer</Container>
    </Container>
    </Router>
  );
}

export default App;
