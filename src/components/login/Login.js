import React, {Component} from 'react'

import {
    Redirect,
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.css';
import './Login.css'

import name from '../../resources/name.png'

import * as firebase from 'firebase/firebase'
import 'firebase/firestore'

var firebaseConfig = {
    apiKey: "AIzaSyCRga2DutNQTlXRx4dTddlLihb6-yBjZRA",
    authDomain: "gangazos-28ba9.firebaseapp.com",
    databaseURL: "https://gangazos-28ba9.firebaseio.com",
    projectId: "gangazos-28ba9",
    storageBucket: "gangazos-28ba9.appspot.com",
    messagingSenderId: "563772293434",
    appId: "1:563772293434:web:ef161d90bd29f52f"
  };
if(!firebase.apps.length)
    firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

class Login extends Component{

    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: "",
            isError: false,
            error: "",
            auth: false,
            check: false
        }
    }

    componentWillMount(){
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({auth: true}, () => {
                    this.setState({check: true})
                })
            }else{
                this.setState({auth: false}, () => {
                    this.setState({check: true})
                })
            }
          });
    }

    login(){
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {
            this.setState({auth: true})
        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            this.setState({isError: true, error: errorMessage})
        });
    }

    render(){
        if(!this.state.check)
            return <div className = "container"/>
        if(this.state.auth)
            return <Redirect to = {{pathname: "/cupones"}}/>
        return(
            <div className = "container d-flex justify-content-center vertical-center flex-column">

                {
                    this.state.isError ? 
                    <div class="alert alert-danger" role="alert">
                        {this.state.error}
                    </div>
                    : null
                }

                <img src = {name} className = "name"/>
                <div className="card shadow" style={{width: '18rem'}}>
                    <div className="card-body">

                        <form>
                            <div className="form-group">
                                <label for="exampleInputEmail1">Correo electrónico</label>
                                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Correo"
                                onChange = {(event) => {
                                    this.setState({email: event.target.value})
                                }}/>
                            </div>
                            <div className="form-group">
                                <label for="exampleInputPassword1">Contraseña</label>
                                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Contraseña"
                                onChange = {(event) => {
                                    this.setState({password: event.target.value})
                                }}/>
                            </div>
                        </form>    
                    
                        <button type="submit" className="btn btn-primary btn-block btn-login"
                            onClick = {() => {
                                this.login()
                            }}>Iniciar sesión</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;