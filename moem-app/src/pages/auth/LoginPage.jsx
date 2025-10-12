import logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const LoginPage = () => {
  const[username, setUsername]= useState('');
  const[password, setPassword]=useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

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

    if (!username.trim() || !password.trim() ) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok){

        await response.text();
       
        navigate("/main");
      }else {

        alert('아이디나 비밀번호가 잘못되었습니다');
        }
      }catch (error) {
      console.error('회원가입 중 오류:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
    }
};

    try {
      await login({ username, password }); // AuthContext의 login 사용
      navigate('/main');
      showSuccess('로그인되었습니다!');
    } catch (error) {
      showError(error.message);
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
      
      <button type="submit" className='login-btn'>로그인</button>
      
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

export default LoginPage;