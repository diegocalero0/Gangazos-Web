import React, {Component} from 'react'

import './Tiendas.css'
import NavBar from '../navBar/NavBar'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import {
    Redirect,
} from "react-router-dom";

import * as firebase from 'firebase/firebase'
import 'firebase/firestore'
import ModalAddShop from '../modal/ModalAddShop'
import ModalAddBranch from '../modal/ModalAddBranch'

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


class Tiendas extends Component{
    constructor(props){
        super(props);

        this.state = {
            isError: false,
            error: '',
            auth: false,
            check: false,
            cities: [],
            citySelected: '',
            citySelectedName: '',
            disponibility: 'Todos',
            shops: [],
            shopSelected: '',
            shopSelectedName: '',
            branches: [],
            branchSelected: '',
            coupons: [],
            showModal: false,
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
            let cities = [];
            querySnapshot.forEach((doc) => {
                let city = doc.data();
                city.id = doc.id;
                    
                cities.push(city);
                
            });
            if(cities.length)
                this.setState({citySelected: cities[0].id, citySelectedName: cities[0].nombre})

            this.setState({cities})

        })

        db.collection('tiendas').orderBy('nombre').onSnapshot((querySnapshot) => {
            var shops = [];
            querySnapshot.forEach((doc) => {
                let shop = doc.data();
                shop.id = doc.id;
                shops.push(shop);
            });

            if(shops.length)
                this.setState({shopSelected: shops[0].id, shopSelectedName: shops[0].nombre})

            this.setState({shops})

        }, err => {
            this.setState({isError: true, error: err})
        })
    }

    loadBranches = (shopSelected) => {
        db.collection('tiendas').doc(shopSelected).collection('sucursales').orderBy('direccion').onSnapshot((querySnapshot) => {
            var branches = [];
            querySnapshot.forEach((doc) => {
                let branch = doc.data();
                branch.id = doc.id;
                if(branch.ciudad == this.state.citySelectedName)
                    branches.push(branch);
            });

            this.setState({branches})

        }, err => {
            this.setState({isError: true, error: err})
        })
    }

    logOut = () => {
        firebase.auth().signOut().then(() => {
          }).catch(function(error) {
            
          });
    }

    addShop = (shop, err) => {

        if(err){
            this.setState({isError: true, error: 'No pueden existir datos vacíos'})
            return
        }

        db.collection('tiendas').add(shop)
    }

    addBranch = (branch, err) => {
        if(err){
            this.setState({isError: true, error: 'No pueden existir datos vacíos'})
            return
        }

        if(this.state.shopSelected.trim() == '' || this.state.citySelected.trim() == ''){
            this.setState({isError: true, error: 'Seleccione primero la ciudad y la tienda'})
            return;
        }

        if(parseFloat(branch.latitude) < -90 || parseFloat(branch.latitude) > 90){
            this.setState({isError: true, error: 'Ingrese una latitud válida'})
            return;
        }

        if(parseFloat(branch.longitude) < -90 || parseFloat(branch.longitude) > 90){
            this.setState({isError: true, error: 'Ingrese una longitud válida'})
            return;
        }

        let newBranch = {
            tienda: this.state.shopSelectedName,
            ciudad: this.state.citySelectedName,
            direccion: branch.direccion,
            coordenadas: new firebase.firestore.GeoPoint(parseFloat(branch.latitude), parseFloat(branch.longitude))
        }

        db.collection('tiendas').doc(this.state.shopSelected).collection('sucursales').add(newBranch)
    }

    deleteShop(shopId){
        db.collection("tiendas").doc(shopId).delete().then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    }

    deleteBranch(branchId){
        db.collection("tiendas").doc(this.state.shopSelected).collection('sucursales').doc(branchId).delete().then(function() {
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
                <NavBar logOut = {this.logOut} to = {'/tiendas'}/>
                <div className = "container-fluid mt-2">

                    {
                        this.state.isError ? 
                        <div class = "container-fluid">
                            <div class="row alert alert-danger" role="alert">
                                {this.state.error}
                            </div>
                        </div>
                        : null
                    }

                    <div class = "row">

                        <div class = "col-3">
                            <div class = "row container-fluid">
                                <h2 class = "text-white">Ciudades</h2>
                            </div>

                            <table className="table table-light">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Nombre</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.cities.map((city, index) => {
                                        return (
                                                <tr style = {{backgroundColor: this.state.citySelected == city.id ? '#F3F3F3' : 'white'}}>
                                                    <a
                                                        class = "btn-block btn" onClick = {() => {
                                                            
                                                            this.setState({citySelected: city.id, citySelectedName: city.nombre}, () => {
                                                                this.loadBranches(this.state.shopSelected);
                                                            })}}>
                                                        <td>{city.nombre}</td>
                                                    </a>
                                                </tr>
                                        )
                                    })}
                                    
                                </tbody>
                            </table>
                        </div>

                        <div class = "col-4">
                            <div class = "row container-fluid">
                                <button className="float-right text-dropdown btn btn-secondary btn-dropdown mb-2" data-toggle="modal" data-target="#exampleModal"
                                    onClick = {() => {
                                        this.setState({showModal: !this.state.showModal, isError: false})
                                        }}>
                                        Agregar tienda
                                </button>
                            </div>

                            <ModalAddShop addShop = {this.addShop}/>

                            <table className="table table-light">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.shops.map((shop, index) => {
                                        return (
                                                <tr style = {{backgroundColor: this.state.shopSelected == shop.id ? '#F3F3F3' : 'white'}}>
                                                    <a onClick = {() => {this.loadBranches(shop.id); this.setState({shopSelected: shop.id, shopSelectedName: shop.nombre})}}>
                                                        <td>{shop.nombre}</td>
                                                    </a>
                                                    <td>
                                                            <button type="button" class="btn btn-danger" data-toggle="modal" data-target={"#" + shop.id}>
                                                                Eliminar
                                                            </button>

                                                            <div class="modal fade" id={shop.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                                <div class="modal-dialog" role="document">
                                                                    <div class="modal-content">
                                                                    <div class="modal-header">
                                                                        <h5 class="modal-title" id="exampleModalLabel">Eliminar tienda</h5>
                                                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                        <span aria-hidden="true">&times;</span>
                                                                        </button>
                                                                    </div>
                                                                    <div class="modal-body">
                                                                        <p>Está seguro de eliminar la tienda:</p>
                                                                        <p>{shop.nombre}</p>
                                                                    </div>
                                                                    <div class="modal-footer">
                                                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                                                                        <button type="button" class="btn btn-danger" data-dismiss="modal" onClick = {() => {
                                                                            this.deleteShop(shop.id)
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
                        <div class = "col-5">
                            <div class = "row container-fluid">
                                <button className="float-right text-dropdown btn btn-secondary btn-dropdown mb-2" data-toggle="modal" data-target="#exampleModal2"
                                    onClick = {() => {this.setState({showModal: !this.state.showModal, isError: false})}}>
                                        Agregar sucursal
                                </button>

                                {this.state.shopSelectedName != '' && this.state.citySelectedName != '' ? <p class = "text-white" style = {{marginLeft: 10}}>Sucursales de {this.state.shopSelectedName} de {this.state.citySelectedName}</p>
                                : <p class = "text-white" >Seleccione una ciudad y una tienda </p> }

                            </div>

                            <ModalAddBranch addBranch = {this.addBranch}/>

                            <table className="table table-light">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Direccion</th>
                                        <th scope="col">Latitud</th>
                                        <th scope="col">Longitud</th>
                                        <th scope="col">Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.branches.map((branch, index) => {
                                        return (
                                            <tr>
                                                <td>{branch.direccion}</td>
                                                <td>{branch.coordenadas.latitude}</td>
                                                <td>{branch.coordenadas.longitude}</td>
                                                <td>
                                                            <button type="button" class="btn btn-danger" data-toggle="modal" data-target={"#" + branch.id}>
                                                                Eliminar
                                                            </button>

                                                            <div class="modal fade" id={branch.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                                <div class="modal-dialog" role="document">
                                                                    <div class="modal-content">
                                                                    <div class="modal-header">
                                                                        <h5 class="modal-title" id="exampleModalLabel">Eliminar sucursal</h5>
                                                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                        <span aria-hidden="true">&times;</span>
                                                                        </button>
                                                                    </div>
                                                                    <div class="modal-body">
                                                                        <p>Está seguro de eliminar la sucursal:</p>
                                                                        <p>{branch.direccion}</p>
                                                                    </div>
                                                                    <div class="modal-footer">
                                                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                                                                        <button type="button" class="btn btn-danger" data-dismiss="modal" onClick = {() => {
                                                                            this.deleteBranch(branch.id)
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
                </div>
            </div>
        )
    }
}

export default Tiendas;