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

  const [errors, setErrors] = useState({
    username: '',
    nickname: '',
    password: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // username 필드에 한글 입력 체크 (영문, 숫자, 언더스코어만 허용)
    if (name === 'username') {
      // 한글이나 특수문자(언더스코어 제외)가 포함되어 있으면 에러 메시지 표시
      const allowedPattern = /^[a-zA-Z0-9_]*$/;
      if (value && !allowedPattern.test(value)) {
        setErrors({ ...errors, username: '아이디는 영문, 숫자, 언더스코어(_)만 사용할 수 있습니다.' });
        // 한글 입력은 차단하지 않고 에러 메시지만 표시
        // 입력값에서 한글을 제거
        const filteredValue = value.replace(/[^a-zA-Z0-9_]/g, '');
        setFormData({ ...formData, [name]: filteredValue });
        return;
      } else {
        // 유효한 입력이면 에러 메시지 제거
        setErrors({ ...errors, username: '' });
      }
    } else {
      // 다른 필드는 에러 메시지 초기화
      setErrors({ ...errors, [name]: '' });
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // 에러 메시지 초기화
    const newErrors = {
      username: '',
      nickname: '',
      password: '',
      email: ''
    };

    let hasError = false;

    if (!username.trim() || !nickname.trim() || !password.trim() || !email.trim()) {
      if (!username.trim()) newErrors.username = '아이디를 입력해주세요.';
      if (!nickname.trim()) newErrors.nickname = '닉네임을 입력해주세요.';
      if (!password.trim()) newErrors.password = '비밀번호를 입력해주세요.';
      if (!email.trim()) newErrors.email = '이메일을 입력해주세요.';
      setErrors(newErrors);
      return;
    }

    // 백엔드 유효성 검사와 일치하도록 클라이언트에서도 검사
    if (username.length < 4 || username.length > 20) {
      newErrors.username = '아이디는 4자 이상 20자 이하로 입력해주세요.';
      hasError = true;
    }

    // username 한글 및 특수문자 체크 (영문, 숫자, 언더스코어만 허용)
    const usernamePattern = /^[a-zA-Z0-9_]+$/;
    if (!usernamePattern.test(username)) {
      newErrors.username = '아이디는 영문, 숫자, 언더스코어(_)만 사용할 수 있습니다.';
      hasError = true;
    }

    if (nickname.length < 2 || nickname.length > 15) {
      newErrors.nickname = '닉네임은 2자 이상 15자 이하로 입력해주세요.';
      hasError = true;
    }

    if (password.length < 8 || password.length > 20) {
      newErrors.password = '비밀번호는 8자 이상 20자 이하로 입력해주세요.';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
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
            className={`login-input ${errors.username ? 'border-red-500' : ''}`}
            required
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1 ml-1">{errors.username}</p>
          )}
        </div>
        <div>
          <input
            type="text"
            name="nickname"
            value={nickname}
            onChange={handleChange}
            placeholder="닉네임을 입력하세요"
            className={`login-input ${errors.nickname ? 'border-red-500' : ''}`}
            required
          />
          {errors.nickname && (
            <p className="text-red-500 text-xs mt-1 ml-1">{errors.nickname}</p>
          )}
        </div>
        <div>
          <input
            type="password"
            value={password}
            name='password'
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
            className={`login-input ${errors.password ? 'border-red-500' : ''}`}
            required
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
          )}
        </div>
        <div>
          <input
            type="email"
            value={email}
            name='email'
            onChange={handleChange}
            placeholder="이메일을 입력하세요"
            className={`login-input ${errors.email ? 'border-red-500' : ''}`}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
          )}
        </div>
        <button type="submit" className='signup-btn' disabled={isLoading}>
          {isLoading ? '회원가입 중...' : '회원가입'}
        </button>
       
      </form>
    </div>
    </div>
  )
 };
