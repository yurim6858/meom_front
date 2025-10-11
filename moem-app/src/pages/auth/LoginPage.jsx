import logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

const LoginPage = () => {
  const[username, setUsername]= useState('');
  const[password, setPassword]=useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
  const { name, value } = e.target;
  if (name === 'username') {
    setUsername(value);
  } else if (name === 'password') {
     setPassword(value);
  }
};
 const handleLogin = async (e) => {
  e.preventDefault();

  const response = await fetch('http://localhost:8080/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (response.ok) {
    const result = await response.json();
    if (result.success) {
      navigate('/'); // 로그인 성공 시 홈으로 이동
    } else {
      alert('아이디 또는 비밀번호가 잘못되었습니다.');
    }
  } else {
    alert('서버 연결에 실패했습니다.');
  }
};

  return (
    <div>
        <img src={logo} className="login-logo"/>
        <div>
         <form onSubmit={handleLogin} className="login-box"> 
         <div>
         <input
          type="text"
          name="username"
          value={username}
          onChange={handleInputChange}
          placeholder="아이디"
          className="login-input"
          required
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          name='password'
          onChange={handleInputChange}
          placeholder="비밀번호"
          className="login-input"
          required
        />
      </div>
      <Link to ="/main">
      <button type="submit" className='login-btn'>로그인</button>
      </Link>
      <nav>
      <Link to="/signup">회원가입 </Link>
      <span>|</span>
      <Link to="/signup">아이디 찾기 </Link>
      <span>|</span>
      <Link to="/signup">비밀번호 찾기 </Link> 
      </nav>
    </form>
    </div>
    </div>
  )
}

export default LoginPage