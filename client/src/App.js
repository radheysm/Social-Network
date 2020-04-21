import React, {Fragment} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
const App = () => 
    <Router>
      <Fragment>
        <Navbar/>
        <Route path = '/' component = {Landing}/>
      </Fragment>
    </Router>


export default App;
