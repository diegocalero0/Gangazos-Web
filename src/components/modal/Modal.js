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

class Modal extends Component{

    constructor(props){
        super(props);

        this.state = {
            coupon: {
                nombre: '',
                descripcion: '',
                ciudad: '',
                sucursal: '',
                inicio: null,
                fin: null,
                destacado: true,
                obtenido: 0,
                categoria: '',
                subcategoria: '',
                fecharegistro: new Date(),
                coordenadas: null
            },
            selectedCity: '',
            selectedShop: '',
            cities: [],
            shops: [],
            branches: [],
            categories: [],
            subcategories: []
        }
    }

    componentWillMount(){

        let coupon = this.state.coupon;

        db.collection('categorias').orderBy('nombre').onSnapshot((querySnapshot) => {
            let categories = []
            querySnapshot.forEach((doc) => {
                let category = doc.data()
                category.id = doc.id;
                categories.push(category)
            });
            this.setState({categories: categories}, () => {
                coupon.categoria = categories[0].nombre;
                db.collection('categorias').doc(categories[0].id).collection('subcategorias').orderBy('nombre').onSnapshot((querySnapshot) => {
                    let subcategories = []
                    querySnapshot.forEach((doc) => {
                        let subcategory = doc.data()
                        subcategory.id = doc.id;
                        subcategories.push(subcategory)
                    });
                    if(subcategories.length)
                        coupon.subcategoria = subcategories[0].nombre;
                    this.setState({subcategories: subcategories}, () => {
                        db.collection('ciudades').orderBy('nombre').onSnapshot((querySnapshot) => {
                            var cities = [];
                            querySnapshot.forEach((doc) => {
                                let city = doc.data()
                                city.id = doc.id;
                                cities.push(city)
                            });
                
                            if(cities.length){
                                coupon.ciudad = cities[0].nombre;
                                this.setState({cities, selectedCity: cities[0].nombre})
                            }
                            
                
                            db.collection('tiendas').onSnapshot((querySnapshot) => {
                                var shops = [];
                                querySnapshot.forEach((doc) => {
                                    let shop = doc.data();
                                    shop.id = doc.id;
                                    shops.push(shop);
                                });
                    
                                coupon.tienda = shops[0].nombre
                                this.setState({shops, selectedShop: shops[0].nombre})
                
                                if(!cities.length)
                                    return;

                                db.collection('tiendas').doc(shops[0].id).collection('sucursales').where('ciudad', '==', cities[0].nombre).onSnapshot((querySnapshot) => {
                                    var branches = [{direccion: 'Todas las sucursales'}];
                                    querySnapshot.forEach((doc) => {
                                        let branch = doc.data();
                                        branch.id = doc.id;
                                        branches.push(branch);
                                    });
                                    
                                    coupon.sucursal = 'Todas las sucursales'
                                    this.setState({branches, coupon})
                                }, err => {
                                    this.setState({isError: true, error: err})
                                })
                
                            }, err => {
                                this.setState({isError: true, error: err})
                            })
                        }, err => {
                            this.setState({isError: true, error: err})
                        })
                    })
                })
            })
        })
    }

    loadSucursal(city, shop){
        db.collection('tiendas').doc(shop).collection('sucursales').where('ciudad', '==', city).onSnapshot((querySnapshot) => {
            var branches = [{direccion: 'Todas las sucursales'}];
            querySnapshot.forEach((doc) => {
                let branch = doc.data();
                branch.id = doc.id
                branches.push(branch);
            });

            this.setState({branches})
        }, err => {
            this.setState({isError: true, error: err})
        })
    }

    uploadFile(file){
        let coupon = this.state.coupon;
        coupon.imagen = file
        this.setState({coupon})
    }

    loadSubCategories(idcategoria){

        let coupon = this.state.coupon;

        db.collection('categorias').doc(idcategoria).collection('subcategorias').orderBy('nombre').onSnapshot((querySnapshot) => {
            let subcategories = []
            querySnapshot.forEach((doc) => {
                let subcategory = doc.data()
                subcategory.id = doc.id;
                subcategories.push(subcategory)
            });
            if(subcategories.length)
                coupon.subcategoria = subcategories[0].nombre;

            this.setState({subcategories: subcategories, coupon})
        })
    }

    validar(){
        let coupon = this.state.coupon;

        if(coupon.categoria.trim() == ''
        || coupon.ciudad.trim() == ''
        || coupon.descripcion.trim() == ''
        || coupon.nombre.trim() == ''
        || coupon.inicio == null
        || coupon.fin == null
        || coupon.subcategoria.trim() == ''
        || coupon.sucursal.trim() == ''){
            return false;
        }
            
        

        return true;
    }

    setCoordenadas(idSucursal){
        db.collection('tiendas').doc(this.state.selectedShop).collection('sucursales')
        .doc(idSucursal).get().then(querySnapshot => {
            let coupon = this.state.coupon
            coupon.coordenadas = querySnapshot.data().coordenadas
            this.setState(coupon)
        })
    }

    render(){
        return(
          
         
            
            <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Agregar cupón</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label for="exampleInputEmail1">Nombre</label>
                                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Nombre de la promoción"
                                onChange = {(event) => {
                                    let coupon = this.state.coupon;
                                    coupon.nombre = event.target.value;
                                    this.setState({coupon})
                                }}/>
                            </div>
                            <div className="form-group">
                                <label for="exampleInputPassword1">Descripcion</label>
                                <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Descripción"
                                onChange = {(event) => {
                                    let coupon = this.state.coupon;
                                    coupon.descripcion = event.target.value;
                                    this.setState({coupon})
                                }}/>
                            </div>

                            <div class="form-group">
                                <label for="imagen">Imagen de portada</label>
                                <input type="file" class="form-control-file" id="imagen"
                                onChange={ (e) => this.uploadFile(e.target.files[0]) }/>
                            </div>

                            <div className="form-group">
                                <label for="destacado">Destacado</label>
                                <select className="form-control" id="destacado"
                                onChange = {(event) => {

                                    let coupon = this.state.coupon;
                                    coupon.destacado = event.target.value == 'Si' ? true : false;
                                    this.setState({coupon})
                                }}>
                                <option>Si</option>
                                <option>No</option>
                                </select>
                            </div>


                            <div className="form-group">
                                <label for="exampleFormControlSelect1">Ciudad</label>
                                <select className="form-control" id="exampleFormControlSelect1"
                                onChange = {(event) => {

                                    let coupon = this.state.coupon;
                                    coupon.ciudad = event.target.value;
                                    this.setState({coupon})

                                    this.setState({selectedCity: event.target.value}, () => {
                                        this.loadSucursal(this.state.selectedCity, this.state.selectedShop)
                                    })
                    
                                }}>
                                {this.state.cities.map((city) => {
                                    return(
                                        <option>{city.nombre}</option>
                                    )
                                })}
                                </select>
                            </div>

                            <div className="form-group">
                                <label for="exampleFormControlSelect1">Tienda</label>
                                <select onChange = {(event) => {
                                    
                                    let index = event.nativeEvent.target.selectedIndex;

                                    let coupon = this.state.coupon;
                                    coupon.tienda = event.nativeEvent.target[index].text;
                                    this.setState({coupon})

                                    this.setState({selectedShop: event.target.value}, () => {
                                        this.loadSucursal(this.state.selectedCity, this.state.selectedShop)
                                    })
                                    
                                }} className="form-control" id="exampleFormControlSelect1">
                                {this.state.shops.map((shop) => {
                                    return(
                                        <option id ={shop.nombre} value = {shop.id}>{shop.nombre}</option>
                                    )
                                })}
                                </select>
                            </div>

                            <div className="form-group">
                                <label for="exampleFormControlSelect1">Sucursal</label>
                                <select onChange = {(event) => {
                                    let index = event.nativeEvent.target.selectedIndex;
                                    let coupon = this.state.coupon;
                                    coupon.sucursal = event.nativeEvent.target[index].text;
                                    
                                    this.setCoordenadas(event.target.value);

                                    this.setState({coupon})
                                    
                                }} className="form-control" id="exampleFormControlSelect1">
                                {this.state.branches.map((branch) => {
                                    return(
                                        <option value = {branch.id}>{branch.direccion}</option>
                                    )
                                })}
                                </select>
                            </div>

                            <div className="form-group">
                                <label for="category">Categoría</label>
                                <select onChange = {(event) => {
                                    let index = event.nativeEvent.target.selectedIndex;
                                    let coupon = this.state.coupon;
                                    coupon.categoria = event.nativeEvent.target[index].text;
                                    this.setState({coupon})
                                    this.loadSubCategories(event.target.value)
                                }} className="form-control" id="category">
                                {this.state.categories.map((category) => {
                                    return(
                                        <option value = {category.id}>{category.nombre}</option>
                                    )
                                })}
                                </select>
                            </div>

                            <div className="form-group">
                                <label for="subcategory">Subcategoría</label>
                                <select onChange = {(event) => {
                                    let coupon = this.state.coupon;
                                    coupon.subcategoria = event.target.value;
                                    this.setState({coupon})
                                }} className="form-control" id="subcategory">
                                {this.state.subcategories.map((subcategory) => {
                                    return(
                                        <option>{subcategory.nombre}</option>
                                    )
                                })}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className = "mr-2" for="">Fecha inicio</label>
                                    <DateTimePicker
                                    onChange={(value) => {
                                        let coupon = this.state.coupon;
                                        coupon.inicio = value;
                                        this.setState({coupon})
                                    }}
                                    value={this.state.coupon.inicio}
                                />
                            </div>

                            <div className="form-group">
                                <label className = "mr-2" for="">Fecha fin</label>
                                    <DateTimePicker
                                    onChange={(value) => {
                                        let coupon = this.state.coupon;
                                        coupon.fin = value;
                                        this.setState({coupon})
                                    }}
                                    value={this.state.coupon.fin}
                                />
                            </div>
                        </form>   
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="button" className="btn btn-primary" data-dismiss="modal" onClick = {() => {
                        if(this.validar()){
                            let coupon = this.state.coupon
                            coupon.fecharegistro = new Date();
                            this.props.addCoupon(coupon, 0);
                        }else{
                            this.props.addCoupon(this.state.coupon, 1);
                        }
                    }}>Agregar cupón</button>
                </div>
                </div>
            </div>
            </div>
        )
    }
}

export default Modal;