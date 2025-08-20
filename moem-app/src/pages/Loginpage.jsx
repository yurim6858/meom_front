import React from 'react'
import logo from '../assets/logo.png'
import { Logincomponent } from '../components/Logincomponent'


const Loginpage = () => {
  return (
    <div>
        <img src={logo} className="login-logo"/>
        <Logincomponent/>
    </div>
  )
}

export default Loginpage