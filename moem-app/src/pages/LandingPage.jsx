import React from 'react'
import logo from '../assets/logo.png'
import poster from '../assets/poster.png'
import HomeButton from '../components/HomeButton'

const LandingPage = () => {
  return (
    <div>
    <div className='header-container'>
        <img src={logo} className="logo-img"/>
        <div >
        <HomeButton/>
        </div> 
      </div>
      <img src={poster} className="poster-img"/>
       </div>
  )
}

export default LandingPage