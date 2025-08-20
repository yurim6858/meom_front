import React from 'react'
import logo from '../assets/logo.png'
import Maincomponent from '../components/maincomponent'

export const Mainpage = () => {
  return (
    <div className='header-container'>
        <img src={logo} className="logo-img"/>
        <div >
        <Maincomponent/>
        </div>
    </div>
  )
}
