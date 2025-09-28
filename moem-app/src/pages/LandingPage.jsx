import React from 'react'
import logo from '../assets/logo.png'
import poster from '../assets/poster.png'
import { Link } from 'react-router-dom';


const LandingPage = () => {
  return (
    <div>
    <div className='header-container'>
        <img src={logo} className="logo-img"/>
        <div className="btn">
            <nav>
              <Link to ="/login">로그인</Link>
              <Link to ="/login">
              <button>회원가입</button>
              </Link>
              </nav>
        </div> 
      </div>
      <img src={poster} className="poster-img"/>
       </div>
  )
}

export default LandingPage
