import React ,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


export const Logincomponent = () => {
    const[userid, setUserid]= useState('');
    const[password, setPassword]=useState('');
    const navigate = useNavigate();

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

        if(userid==='root'&& password==='1234'){
            navigate('/')
        }else{
            alert('아이디 또는 비밀번호가 잘 못 되었습니다.')
        }
    }
  return (
    <div>
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
      <Link to="/signup">회원가입 </Link>
      <span>|</span>
      <Link to="/signup">아이디 찾기 </Link>
      <span>|</span>
      <Link to="/signup">비밀번호 찾기 </Link> 
      </nav>
    </form>
    </div>
    
  );
};

