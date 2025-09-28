import logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'userid') {
      setUserid(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // 간단한 사용자 데이터베이스 (실제로는 서버에서 가져와야 함)
    const users = [
      { id: 1, username: 'root', password: '1234', name: '관리자', email: 'admin@example.com' },
      { id: 2, username: 'minji', password: '1234', name: '민지', email: 'minji@example.com' },
      { id: 3, username: 'hyunsoo', password: '1234', name: '현수', email: 'hyunsoo@example.com' }
    ];

    const user = users.find(u => u.username === userid && u.password === password);
    
    if (user) {
      // 로그인 성공 - 사용자 정보 저장
      login({
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email
      });
      navigate('/main');
    } else {
      alert('아이디 또는 비밀번호가 잘못되었습니다.');
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
                        name="userid"
                        value={userid}
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

export default LoginPage