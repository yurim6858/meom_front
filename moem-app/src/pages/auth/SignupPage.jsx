import React, { useState } from 'react'
import logo from '../../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { AuthAPI } from '../../services/api/index';

export const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    name: ''
  });
  const [usernameCheck, setUsernameCheck] = useState({
    checking: false,
    available: null,
    message: ''
  });
  const { username, password, confirmPassword, email, name } = formData;
  const { showSuccess, showError } = useToast();
  const { register } = useAuth();
  const navigate = useNavigate();
  const authAPI = new AuthAPI();

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

  // 아이디 중복 확인
  const checkUsername = async () => {
    if (!username.trim()) {
      showError('아이디를 입력해주세요.');
      return;
    }

    try {
      setUsernameCheck({ checking: true, available: null, message: '확인 중...' });
      const exists = await authAPI.checkUsername(username);
      
      if (exists) {
        setUsernameCheck({
          checking: false,
          available: false,
          message: '이미 사용 중인 아이디입니다.'
        });
      } else {
        setUsernameCheck({
          checking: false,
          available: true,
          message: '사용 가능한 아이디입니다.'
        });
      }
    } catch (error) {
      setUsernameCheck({
        checking: false,
        available: null,
        message: '확인 중 오류가 발생했습니다.'
      });
      showError('아이디 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!formData.username.trim() || !formData.password.trim() || !formData.email.trim()) {
      showError('모든 필드를 입력해주세요');
      return;
    }

    // 아이디 중복 확인이 되지 않았거나 중복된 경우
    if (usernameCheck.available === null) {
      showError('아이디 중복 확인을 해주세요.');
      return;
    }

    if (usernameCheck.available === false) {
      showError('사용할 수 없는 아이디입니다.');
      return;
    }

    try {
      await register({
        username: formData.username,
        password: formData.password,
        email: formData.email
      });
      showSuccess("회원가입이 완료되었습니다!");
      navigate('/login');
    } catch (error) {
      showError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        {/* 로고 */}
        <div className="mb-12">
          <img src={logo} alt="로그" className="login-logo"/>
        </div>
        
        {/* 회원가입 폼 */}
        <form onSubmit={handleSubmit} className="login-box">
          <div>
            <div className="flex gap-2">
              <input
                type="text"
                name="username"
                value={username}
                onChange={handleChange}
                placeholder="아이디"
                className="login-input flex-1"
                required
              />
              <button
                type="button"
                onClick={checkUsername}
                disabled={usernameCheck.checking || !username.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
              >
                {usernameCheck.checking ? '확인중...' : '중복확인'}
              </button>
            </div>
            {usernameCheck.message && (
              <div className={`mt-1 text-sm ${
                usernameCheck.available === true ? 'text-green-600' : 
                usernameCheck.available === false ? 'text-red-600' : 
                'text-gray-600'
              }`}>
                {usernameCheck.message}
              </div>
            )}
          </div>
          <div>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder="이름"
              className="login-input"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="이메일"
              className="login-input"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="비밀번호"
              className="login-input"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호 확인"
              className="login-input"
              required
            />
          </div>
          <button type="submit" className='login-btn'>회원가입</button>
          <nav>
            <Link to="/login">로그인으로 돌아가기</Link>
          </nav>
        </form>
      </div>
    </div>
  );
}