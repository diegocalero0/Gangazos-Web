import React, {Component} from 'react'

import './Cupones.css'
import NavBar from '../navBar/NavBar'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import {
    Redirect,
} from "react-router-dom";

import * as firebase from 'firebase/firebase'
import 'firebase/firestore'

import Modal from '../modal/Modal'

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
const storage = firebase.storage();

class Cupones extends Component{
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
            if(cities.length)
                this.setState({citySelected: cities[0].nombre})

            db.collection('tiendas').onSnapshot((querySnapshot) => {
                var shops = [{nombre: 'Todas las tiendas'}];
                querySnapshot.forEach((doc) => {
                    shops.push(doc.data());
                });
    
                this.setState({shops, shopSelected: shops[0].nombre})
            }, err => {
                this.setState({isError: true, error: err})
            })

            if(!cities.length)
                return;
        

            db.collection('cupones').where('ciudad', '==', cities[0].nombre).onSnapshot((querySnapshot) => {
                var coupons = [];
                querySnapshot.forEach((doc) => {

                    let coupon = doc.data();
                    coupon.id = doc.id
                    coupons.push(coupon);
                });
    
                this.setState({coupons})
    
            }, err => {
                this.setState({isError: true, error: err})
            })

        }, err => {
            this.setState({isError: true, error: err})
        })
    }

    filterAllShops(){
        db.collection('cupones').where('ciudad', '==', this.state.citySelected).get()
        .then((querySnapshot) => {
            var coupons = [];
            querySnapshot.forEach((doc) => {

                let coupon = doc.data();
                coupon.id = doc.id

                if(this.state.disponibility == 'Disponibles'){
                    let inicio = new Date(coupon.inicio.seconds * 1000);
                    let fin = new Date(coupon.fin.seconds * 1000);

                    if(new Date() >= inicio && new Date() <= fin){
                        coupons.push(coupon);
                    }

                }else if(this.state.disponibility == 'No disponibles'){
                    let inicio = new Date(coupon.inicio.seconds * 1000);
                    let fin = new Date(coupon.fin.seconds * 1000);

                    if(new Date() < inicio || new Date() > fin){
                        coupons.push(coupon);
                    } 
                }else{
                    coupons.push(coupon);
                }
            });
            this.setState({coupons})
        })
    }

    filter(){

        if(this.state.shopSelected == 'Todas las tiendas'){
            this.filterAllShops();
            return;
        }

        db.collection('cupones').where('tienda', '==', this.state.shopSelected).where('ciudad', '==', this.state.citySelected).get()
        .then((querySnapshot) => {
            var coupons = [];
            querySnapshot.forEach((doc) => {

                let coupon = doc.data();
                coupon.id = doc.id

                if(this.state.disponibility == 'Disponibles'){
                    let inicio = new Date(coupon.inicio.seconds * 1000);
                    let fin = new Date(coupon.fin.seconds * 1000);

                    if(new Date() >= inicio && new Date() <= fin){
                        coupons.push(coupon);
                    }

                }else if(this.state.disponibility == 'No disponibles'){
                    let inicio = new Date(coupon.inicio.seconds * 1000);
                    let fin = new Date(coupon.fin.seconds * 1000);

                    if(new Date() < inicio || new Date() > fin){
                        coupons.push(coupon);
                    } 
                }else{
                    coupons.push(coupon);
                }
            });
            this.setState({coupons})
        })
    }

    logOut = () => {
        firebase.auth().signOut().then(() => {
          }).catch(function(error) {
            
          });
    }

    dismiss = () => {
        alert('here')
        this.setState({showModal: !this.state.showModal})
    }

    addCoupon = (coupon, err) => {

        if(err){
            this.setState({isError: true, error: 'Faltan datos en el cupón, vuelva a intentarlo'})
            return
        }

        let doc = db.collection('cupones').doc()

        let file = coupon.imagen
        let storageRef = storage.ref();

        let ref = storageRef.child(doc.id + '.jpg');


        let task = ref.put(file);

        task.on('state_changed', (snapshot) => {

        }, (err) => {
            alert(JSON.stringify(err))
        }, () => {
            doc.imagen = ref.getDownloadURL().then(url => {
                
                coupon.imagen = url;
                doc.set(coupon)
            });
            
        
        })

        
    }

    render(){

        if(!this.state.check)
            return <div className = "container"/>
        if(!this.state.auth)
            return <Redirect to = {{pathname: "/"}}/>
        return(

            <div>

                

                <NavBar logOut = {this.logOut} to = {'/cupones'}/>

                

                <div className = "container-fluid mt-2">
                    <div className = "container-fluid row mt-4 mb-4">
                        <div className="dropdown mr-2">
                            <button className="text-dropdown btn btn-secondary dropdown-toggle btn-dropdown" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {this.state.citySelected}
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">

                                {this.state.cities.map((city) => {
                                    return(
                                        <a className="dropdown-item" onClick = {() => {
                                            this.setState({citySelected: city.nombre}, () => {this.filter()})
                                            
                                        }}>{city.nombre}</a>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="dropdown mr-2">
                            <button className="text-dropdown btn btn-secondary dropdown-toggle btn-dropdown" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {this.state.shopSelected}
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">

                                {this.state.shops.map((shop) => {
                                    return(
                                        <a className="dropdown-item" onClick = {() => {
                                            this.setState({shopSelected: shop.nombre}, () => {this.filter()})
                                            
                                        }}>{shop.nombre}</a>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="dropdown mr-2">
                            <button className="text-dropdown btn btn-secondary dropdown-toggle btn-dropdown" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {this.state.disponibility}
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a className="dropdown-item" onClick = {() => {this.setState({disponibility: 'Todos'}, () => {this.filter()})}}>Todos</a>
                            <a className="dropdown-item" onClick = {() => {this.setState({disponibility: 'Disponibles'}, () => {this.filter()})}}>Disponibles</a>
                            <a className="dropdown-item" onClick = {() => {this.setState({disponibility: 'No disponibles'}, () => {this.filter()})}}>No disponibles</a>
                            </div>
                        </div>

                    </div>

                    <div class = "row container-fluid">
                        <button className="float-right text-dropdown btn btn-secondary btn-dropdown mb-2" data-toggle="modal" data-target="#exampleModal"
                            onClick = {() => {this.setState({showModal: !this.state.showModal, isError: false})}}>
                                Agregar cupón
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

                    <Modal addCoupon = {this.addCoupon}/>

                    <table className="table table-light">
                        <thead className="thead-light">
                            <tr>

                            <th scope="col">QR</th>
                            <th scope="col">Imagen</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Descripción</th>
                            <th scope="col">Inicio</th>
                            <th scope="col">Fin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.coupons.map((coupon, index) => {
                                return (
                                    <tr>
                                        <th scope="row"><QRCode size = {100} value={coupon.id} /></th>
                                        <td><img src = {coupon.imagen} className = "imagen_coupon"/></td>
                                        <td>{coupon.nombre}</td>
                                        <td>{coupon.descripcion}</td>
                                        <td>{new Date(coupon.inicio.seconds * 1000).toDateString()}</td>
                                        <td>{new Date(coupon.fin.seconds * 1000).toDateString()}</td>
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

export default Cupones;