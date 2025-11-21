import logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { AuthAPI } from '../../services/api/index';

const LoginPage =  () => {
  const[username, setUsername]= useState('');
  const[password, setPassword]=useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const authAPI = new AuthAPI();

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

    if (!username.trim() || !password.trim()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const loginData = { username, password };
      const response = await authAPI.login(loginData);
      
      // JWT 토큰과 사용자 정보 저장
      authAPI.saveToken(response.accessToken, response.username);
      
      // 사용자 상세 정보 조회 및 저장 (토큰 저장 후)
      try {
        const authUsers = await authAPI.getAuthUsers();
        const currentUser = authUsers.find(user => user.username === response.username);
        if (currentUser) {
          localStorage.setItem('email', currentUser.email);
          localStorage.setItem('userId', currentUser.id.toString());
        }
      } catch (userInfoError) {
        console.warn('사용자 상세 정보 조회 실패:', userInfoError);
        // 사용자 정보 조회 실패해도 로그인은 성공으로 처리
      }
      
      alert('로그인 성공!');
      navigate("/main");
    } catch (error) {
      console.error('로그인 중 오류:', error);
      alert(error.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <img src={logo} className="login-logo mb-20"/>
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
      
      <button type="submit" className='login-btn' disabled={isLoading}>
        {isLoading ? '로그인 중...' : '로그인'}
      </button>
      
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