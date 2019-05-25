import React, {Component} from 'react'

import {
    Redirect,
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.css';
import './Modal.css'

import * as firebase from 'firebase/firebase'
import 'firebase/firestore'
import DateTimePicker from 'react-datetime-picker'

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


class ModalAddBranch extends Component{

    constructor(props){
        super(props);

        this.state = {
            branch: {
                direccion: '',
                latitude: '',
                longitude: ''
            }
        }
    }

    validar(){
        let branch = this.state.branch;

        if(branch.direccion.trim() == '' || branch.latitude.trim() == '' || branch.longitude.trim() == ''){
            alert(branch.direccion + ' ' + branch.latitude + ' ' + branch.longitude)
            return false;
        }

        return true;
    }

    render(){
        return(
          
         
            
            <div className="modal fade" id="exampleModal2" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Agregar sucursal</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label for="nombre">Dirección</label>
                                <input value = {this.state.branch.direccion} type="text" className="form-control" id="nombre" aria-describedby="emailHelp" placeholder="Dirección de la sucursal"
                                onChange = {(event) => {
                                    let branch = this.state.branch;
                                    branch.direccion = event.target.value;
                                    this.setState({branch})
                                }}/>
                            </div>

                            <div className="form-group">
                                <label for="latitude">Latitud</label>
                                <input value = {this.state.branch.latitude} type="number" className="form-control" id="latitude" aria-describedby="emailHelp" placeholder="Latitud de la coordenada"
                                onChange = {(event) => {
                                    let branch = this.state.branch;
                                    branch.latitude = event.target.value;
                                    this.setState({branch})
                                }}/>
                            </div>

                            <div className="form-group">
                                <label for="longitude">Longitud</label>
                                <input value = {this.state.branch.longitude} type="number" className="form-control" id="nombre" aria-describedby="emailHelp" placeholder="Longitud de la coordenada"
                                onChange = {(event) => {
                                    let branch = this.state.branch;
                                    branch.longitude = event.target.value;
                                    this.setState({branch})
                                }}/>
                            </div>

                        </form>   
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="button" className="btn btn-primary" data-dismiss="modal" onClick = {() => {
                        if(this.validar()){
                            this.props.addBranch(this.state.branch, 0);
                            this.setState({branch: {direccion: '', longitude: '', latitude: ''}})
                        }else{
                            this.props.addBranch(this.state.branch, 1);
                        }
                    }}>Agregar sucursal</button>
                </div>
                </div>
            </div>
            </div>
        )
    }
}

export default ModalAddBranch;