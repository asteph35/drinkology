import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"

import './App.css'
import NavBar from "./components/navbar"
import All from "./pages/all"
import HomePage from './pages/home'
import MyBar from "./pages/mybar"
import Instructions from "./pages/instructions"
import UserStore from "./stores/UserStore"
import LoginForm from "./components/LoginForm"
import InputField from "./components/InputField"
import SubmitButton from "./components/SubmitButton"
import {observer} from 'mobx-react'
const INGREDIENT_PATH = "https://www.thecocktaildb.com/api/json/v2/9973533/list.php?i=list"
class App extends React.Component{




    render() {
    
        return (
            <div className="App">
                <NavBar/>
                <main>
                    <Switch>
                        <Route exact path='/' component={HomePage} />
                        <Route path='/home' component={HomePage} />
                        <Route path='/mybar' component={MyBar}  />
                        <Route path='/all' component={All} />
                        <Route path='/instructions/:id' component={Instructions} />
                        <Route path='/find/:category/:element' component={All} />
                    </Switch>
                </main>
            </div>
        )
    }
}
 
export default observer(App)