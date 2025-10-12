import React, { useState } from 'react'
import logo from '../../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom';

export const SignupPage = () => {
  const navigate= useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    nickname:'',
    password: '',
    email: ''
  });
  const { username, nickname, password, email } = formData;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    
    // 아이디가 변경되면 중복 확인 상태 초기화
    if (name === 'username') {
      setUsernameCheck({
        checking: false,
        available: null,
        message: ''
      });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username.trim() || !nickname.trim() || !password.trim() || !email.trim()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: formData.username,
          nickname: formData.nickname, 
          password: formData.password, 
          email: formData.email,
         })
      });

      if (response.ok){

        await response.text();
        alert('회원가입이 완료되었습니다!');
        navigate("/login");
      }else {

        alert('회원가입 실패: 중복된 아이디 또는 서버 오류입니다.');
        }
      }catch (error) {
      console.error('회원가입 중 오류:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
    }
  }
  

  return (
    <div>
        <img src={logo} className="login-logo"/>
        <div>
      <form onSubmit={handleSignup} className="signup-box">
        <div>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
            placeholder="아이디를 입력하세요"
            className="login-input"
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="nickname"
            value={nickname}
            onChange={handleChange}
            placeholder="닉네임을 입력하세요"
            className="login-input"
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            name='password'
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
            className="login-input"
            required
          />
        </div>
        <div>
          <input
            type="email"
            value={email}
            name='email'
            onChange={handleChange}
            placeholder="이메일을 입력하세요"
            className="login-input"
            required
          />
        </div>
        <button type="submit" className='signup-btn'>회원가입</button>
       
      </form>
    </div>
    </div>
  )
 };
