import React, {Component} from 'react'
import './NavBar.css'

import {
    Redirect,
} from "react-router-dom";

class NavBar extends Component{

    constructor(props){
        super(props);

        this.state = {
            redirect: false,
            to: ''
        }

    }

    render(){

        if(this.state.redirect){
            if(this.state.to != this.props.to)
                return <Redirect to = {{pathname: this.state.to}}/>
        }

        return(
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark navBarSelf">
                    <a className="navbar-brand" href="#">Gangazos</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <a className="nav-link" href="" onClick = {() => {
                                    this.setState({redirect: true, to: '/cupones'})
                                }}>Cupones <span className="sr-only">(current)</span></a>
                            </li>
                            <li className="nav-item active">
                                <a className="nav-link" href="" onClick = {() => {
                                    this.setState({redirect: true, to: '/ciudades'})
                                }}>Ciudades <span className="sr-only">(current)</span></a>
                            </li>
                            <li className="nav-item active">
                                <a className="nav-link" href="" onClick = {() => {
                                    this.setState({redirect: true, to: '/tiendas'})
                                }}>Tiendas <span className="sr-only">(current)</span></a>
                            </li>
                            <li className="nav-item active">
                                <a className="nav-link" href="" onClick = {() => {
                                    this.setState({redirect: true, to: '/categorias'})
                                }}>Categorias <span className="sr-only">(current)</span></a>
                            </li>
                        </ul>
                        <button className="btn btn-light my-2 my-sm-0"
                        onClick = {() => {
                            this.props.logOut();
                        }}>Cerrar sesión</button>                      
                    </div>
                </nav>
            </div>
        )
    }
}

export default NavBar;