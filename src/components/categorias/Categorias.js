import React, {Component} from 'react'

import './Categorias.css'
import NavBar from '../navBar/NavBar'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import {
    Redirect,
} from "react-router-dom";

import * as firebase from 'firebase/firebase'
import 'firebase/firestore'

import ModalAddCategory from '../modal/ModalAddCategory'
import ModalAddSubCategory from '../modal/ModalAddSubCategory'

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


class Categorias extends Component{
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
            showModal: false,
            categories: [],
            subCategories: [],
            categorySelected: ''
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

        db.collection('categorias').orderBy('nombre').onSnapshot((querySnapshot) => {
            var categories = [];
            querySnapshot.forEach((doc) => {
                let category = doc.data();
                category.id = doc.id;
                categories.push(category);
                
            });

            this.setState({categories})

        }, err => {
            this.setState({isError: true, error: err})
        })
    }

    loadSubCategories = (categorySelected) => {
        db.collection('categorias').doc(categorySelected).collection('subcategorias').orderBy('nombre').onSnapshot((querySnapshot) => {
            var subCategories = [];
            querySnapshot.forEach((doc) => {
                let category = doc.data();
                category.id = doc.id;
                subCategories.push(category);
                
            });

            this.setState({subCategories: subCategories})

        }, err => {
            this.setState({isError: true, error: err})
        })
    }

    logOut = () => {
        firebase.auth().signOut().then(() => {
          }).catch(function(error) {
            
          });
    }

    addCategory = (category, err) => {

        if(err){
            this.setState({isError: true, error: 'El nombre no puede estar vacío'})
            return
        }

        db.collection('categorias').add(category)
    }

    addSubCategory = (subCategory, err) => {

        if(err){
            this.setState({isError: true, error: 'El nombre no puede estar vacío'})
            return
        }

        if(this.state.categorySelected == ''){
            this.setState({isError: true, error: 'Seleccione primero una categoría'})
            return;
        }

        db.collection('categorias').doc(this.state.categorySelected).collection('subcategorias').add(subCategory)
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
                        <div class = "col-6">
                            <div class = "row container-fluid">
                                <button className="float-right text-dropdown btn btn-secondary btn-dropdown mb-2" data-toggle="modal" data-target="#exampleModal"
                                    onClick = {() => {this.setState({showModal: !this.state.showModal, isError: false})}}>
                                        Agregar categoría
                                </button>
                            </div>

                            <ModalAddCategory addCategory = {this.addCategory}/>

                            <table className="table table-light">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Nombre</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.categories.map((category, index) => {
                                        return (
                                            
                                                <tr>
                                                    <button
                                                        class = "btn-block btn" onClick = {() => {this.loadSubCategories(category.id); this.setState({categorySelected: category.id})}}>
                                                        <td>{category.nombre}</td>
                                                    </button>
                                                </tr>
                                        )
                                    })}
                                    
                                </tbody>
                            </table>
                        </div>
                        <div class = "col-6">
                            <div class = "row container-fluid">
                                <button className="float-right text-dropdown btn btn-secondary btn-dropdown mb-2" data-toggle="modal" data-target="#exampleModal2"
                                    onClick = {() => {this.setState({showModal: !this.state.showModal, isError: false})}}>
                                        Agregar subcategoría
                                </button>
                            </div>

                            <ModalAddSubCategory addSubCategory = {this.addSubCategory}/>

                            <table className="table table-light">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Nombre</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.subCategories.map((category, index) => {
                                        return (
                                            <tr>
                                                <td>{category.nombre}</td>
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

export default Categorias;