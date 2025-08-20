import React from 'react'
import logo from '../assets/logo.png'
import { Logincomponent } from '../components/Logincomponent'


const LoginPage = () => {
  return (
    <div>
        <img src={logo} className="login-logo"/>
        <Logincomponent/>
    </div>
  )
}

export default LoginPage