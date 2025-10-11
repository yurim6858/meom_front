import React, { useState } from 'react'
import logo from '../../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';

export const SignupPage = () => {
  const [formData, setFormData] = useState({
    userid: '',
    password: '',
    confirmPassword: '',
    email: '',
    name: ''
  });
  const { userid, password, confirmPassword, email, name } = formData;
  const { showSuccess, showError } = useToast();
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!formData.userid.trim() || !formData.password.trim() || !formData.email.trim()) {
      showError('모든 필스를 입력해주세요');
      return;
    }

    try {
      await register({
        username: formData.userid, // userid를 username으로 매핑
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
            <input
              type="text"
              name="userid"
              value={userid}
              onChange={handleChange}
              placeholder="아이디"
              className="login-input"
              required
            />
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