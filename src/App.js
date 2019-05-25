import React, {Component} from 'react';
import './App.css';

import Login from './components/login/Login'
import Cupones from './components/cupones/Cupones'
import Cupon from './components/cupon/Cupon'
import Ciudades from './components/ciudades/Ciudades'
import Tiendas from './components/tiendas/Tiendas'
import Categorias from './components/categorias/Categorias'

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends Component{
  render() {
    return (
      <Router>
        <Route path="/" exact component={Login} />
        <Route path="/cupones/" component={Cupones} />
        <Route path="/cupon/" component={Cupon} />
        <Route path="/ciudades/" component={Ciudades} />
        <Route path="/tiendas/" component={Tiendas} />
        <Route path="/categorias/" component={Categorias} />
      </Router>
    );
  }
}



export default App;
