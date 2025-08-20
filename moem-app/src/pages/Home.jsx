import React from 'react'
import logo from '../assets/logo.png'
import HomeButton from '../components/HomeButton'

const Home = () => {
  return (
    <div className='header-container'>
        <img src={logo} className="logo-img"/>
        <div >
        <HomeButton/>
        </div>
      </div>
  )
}

export default Home