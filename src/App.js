import React, {useEffect} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"

import {useGlobalError, useTxStatus} from "./hooks"

import {Nav} from "./widgets"
import {Sandbox, Swap, Install} from "./pages"

import {Container} from "./components/styled"
import {Close} from "./visual"

import 'semantic-ui-css/semantic.min.css'
import './App.css';


function App() {
  const [err, setErr, clearErr] = useGlobalError()
  const [txStatus, setTxStatus] = useTxStatus()
  const [showTxStatus, setShowTxStatus] = useTxStatus(true)

  useEffect(()=>{
    setShowTxStatus(true)
  }, [txStatus])
  return (
    <Router>
    <Container root centered className="App">
      <Nav />
      <header className="App-header">
      {!!err && <div style={{border: "pink 2px solid", position: "fixed", top:"20", width:"80%", left:"10%"}}>Error: {err}</div>}
      {txStatus.state !== null && showTxStatus &&
        <div style={{border: "green 2px solid", position: "fixed", top:100, width:"80%", left:"10%"}}>
          <div style={{color: "greenyellow", display:"inline-block", width: "97%"}}>TxStatus: {txStatus.state} </div>
          <Close onClick={()=> setShowTxStatus(false)} style={{flexBasis:9}}/>
        </div>
      }
      </header>
      <Switch>
        <Route path="/sandbox">
          <Sandbox />
        </Route> 
        <Route path="/install">
          <Install />
        </Route> 
        <Route path="/">
          <Swap setGlobalErr={setErr}/>
        </Route>
      </Switch>
      <Container classNme="footer">Footer</Container>
    </Container>
    </Router>
  );
}

export default App;
