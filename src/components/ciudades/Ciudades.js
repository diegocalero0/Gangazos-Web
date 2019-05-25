import React, {Component} from 'react'

import './Ciudades.css'
import NavBar from '../navBar/NavBar'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import {
    Redirect,
} from "react-router-dom";

import * as firebase from 'firebase/firebase'
import 'firebase/firestore'

import ModalAddCity from '../modal/ModalAddCity'

import QRCode from 'qrcode.react';

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


class Ciudades extends Component{
    constructor(props){
        super(props);

        this.state = {
            isError: false,
            error: '',
            auth: false,
            check: false,
            cities: [],
            citySelected: '',
            disponibility: 'Todos',
            shops: [],
            shopSelected: '',
            branches: [],
            branchSelected: '',
            coupons: [],
            showModal: false
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

        db.collection('ciudades').orderBy('nombre').onSnapshot((querySnapshot) => {
            var cities = [];
            querySnapshot.forEach((doc) => {
                cities.push(doc.data());
            });

            this.setState({cities})

        }, err => {
            this.setState({isError: true, error: err})
        })
    }

    logOut = () => {
        firebase.auth().signOut().then(() => {
          }).catch(function(error) {
            
          });
    }

    addCity = (city, err) => {

        if(err){
            this.setState({isError: true, error: 'El nombre no puede estar vacío'})
            return
        }

        db.collection('ciudades').add(city)
    }

    render(){

        if(!this.state.check)
            return <div className = "container"/>
        if(!this.state.auth)
            return <Redirect to = {{pathname: "/"}}/>
        return(

            <div>
                <NavBar logOut = {this.logOut} to = {'/ciudades'}/>
                <div className = "container-fluid mt-2">

                    <div class = "row container-fluid">
                        <button className="float-right text-dropdown btn btn-secondary btn-dropdown mb-2" data-toggle="modal" data-target="#exampleModal"
                            onClick = {() => {this.setState({showModal: !this.state.showModal, isError: false})}}>
                                Agregar Ciudad
                        </button>
                    </div>

                    {
                        this.state.isError ? 
                        <div class = "container-fluid">
                            <div class="row alert alert-danger" role="alert">
                                {this.state.error}
                            </div>
                        </div>
                        : null
                    }

                    <ModalAddCity addCity = {this.addCity}/>

                    <table className="table table-light">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">Nombre</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.cities.map((city, index) => {
                                return (
                                    <tr>
                                        <td>{city.nombre}</td>
                                    </tr>
                                )
                            })}
                            
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default Ciudades;