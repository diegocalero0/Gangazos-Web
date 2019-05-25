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


class ModalAddShop extends Component{

    constructor(props){
        super(props);

        this.state = {
            shop: {
                nombre: ''
            }
        }
    }

    validar(){
        let shop = this.state.shop;

        if(shop.nombre.trim() == ''){
            return false;
        }
        
        this.setState()

        return true;
    }

    render(){
        return(
          
         
            
            <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Agregar tienda</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label for="nombre">Nombre</label>
                                <input value = {this.state.shop.nombre} type="text" className="form-control" id="nombre" aria-describedby="emailHelp" placeholder="Nombre de la tienda"
                                onChange = {(event) => {
                                    let shop = this.state.shop;
                                    shop.nombre = event.target.value;
                                    this.setState({shop})
                                }}/>
                            </div>
                        </form>   
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="button" className="btn btn-primary" data-dismiss="modal" onClick = {() => {
                        if(this.validar()){
                            this.props.addShop(this.state.shop, 0);
                            this.setState({shop: {nombre: ''}})
                        }else{
                            this.props.addShop(this.state.shop, 1);
                        }
                    }}>Agregar tienda</button>
                </div>
                </div>
            </div>
            </div>
        )
    }
}

export default ModalAddShop;