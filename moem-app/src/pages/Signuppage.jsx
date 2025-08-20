import React from 'react'
import logo from '../assets/logo.png'
import Signupcomponent from '../components/Signupcomponent'

export const Signuppage = () => {
  return (
    <div>
        <img src={logo} className="login-logo"/>
        <Signupcomponent/>
    </div>
  )
}
