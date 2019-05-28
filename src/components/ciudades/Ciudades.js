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
                let city = doc.data();
                city.id = doc.id
                cities.push(city);
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

    deleteCity(id){
        db.collection("ciudades").doc(id).delete().then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
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
                                <th scope="col">Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.cities.map((city, index) => {
                                return (
                                    <tr>
                                        <td class = "col-8">{city.nombre}</td>
                                        
                                        <td>
                                            <button type="button" class="btn btn-danger" data-toggle="modal" data-target={"#" + city.id}>
                                                Eliminar
                                            </button>
                                            <div class="modal fade" id={city.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                <div class="modal-dialog" role="document">
                                                    <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title" id="exampleModalLabel">Eliminar ciudad</h5>
                                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    <div class="modal-body">
                                                        <p>Está seguro de eliminar la ciudad:</p>
                                                        <p>{city.nombre}</p>
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                                                        <button type="button" class="btn btn-danger" data-dismiss="modal" onClick = {() => {
                                                            this.deleteCity(city.id)
                                                        }}>Eliminar</button>
                                                    </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                       
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