import React from 'react'
import { Link } from 'react-router-dom';

const Maincomponent = () => {
  return (
    <div class='btn'>
      <nav>
        <Link to ="/login">매칭</Link>
        <Link to ="/">로그아웃</Link>
        <Link to ="/login">마이페이지</Link>
        </nav>
    </div>
  )
}

export default Maincomponent