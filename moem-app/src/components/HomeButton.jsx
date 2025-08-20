import React from 'react'
import { Link } from 'react-router-dom';




const HomeButton = () => {
  return (
    <div class="btn">
      <nav>
        <Link to ="/login">로그인</Link>
        <Link to ="/login">
        <button>회원가입</button>
        </Link>
        </nav>
    </div>
  )
}

export default HomeButton