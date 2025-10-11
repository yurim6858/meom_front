import logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

    try {
      await login({ username, password }); // AuthContext의 login 사용
      navigate('/main');
      showSuccess('로그인되었습니다!');
    } catch (error) {
      showError(error.message);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            {/* 로고 */}
            <div className="mb-12">
                <img src={logo} className="login-logo"/>
            </div>
            
            {/* 로그인 폼 */}
            <form onSubmit={handleLogin} className="login-box"> 
                <div>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={handleInputChange}
                        placeholder="이메일 또는 아이디"
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
                    <Link to="/signup">회원가입</Link>
                    <span>|</span>
                    <Link to="/signup">아이디 찾기</Link>
                    <span>|</span>
                    <Link to="/signup">비밀번호 찾기</Link> 
                </nav>
            </form>
        </div>
    </div>
  )
}

export default LoginPage;