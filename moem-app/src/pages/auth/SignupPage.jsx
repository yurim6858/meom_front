import React, { useState } from 'react'
import logo from '../../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom';
import { AuthAPI } from '../../services/api/index';

export const SignupPage = () => {
  const navigate= useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const authAPI = new AuthAPI();

  const [formData, setFormData] = useState({
    username: '',
    nickname:'',
    password: '',
    email: ''
  });
  const { username, nickname, password, email } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username.trim() || !nickname.trim() || !password.trim() || !email.trim()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // 백엔드 유효성 검사와 일치하도록 클라이언트에서도 검사
    if (username.length < 4 || username.length > 20) {
      alert('아이디는 4자 이상 20자 이하로 입력해주세요.');
      return;
    }

    if (nickname.length < 2 || nickname.length > 15) {
      alert('닉네임은 2자 이상 15자 이하로 입력해주세요.');
      return;
    }

    if (password.length < 8 || password.length > 20) {
      alert('비밀번호는 8자 이상 20자 이하로 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const signupData = {
        username: formData.username,
        nickname: formData.nickname,
        password: formData.password,
        email: formData.email
      };
      
      const response = await authAPI.signup(signupData);
      alert('회원가입이 완료되었습니다!');
      navigate("/login");
    } catch (error) {
      console.error('회원가입 중 오류:', error);
      alert(error.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
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
        <button type="submit" className='signup-btn' disabled={isLoading}>
          {isLoading ? '회원가입 중...' : '회원가입'}
        </button>
       
      </form>
    </div>
    </div>
  )
 };
