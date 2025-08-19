
import React, { useState } from 'react'

const Signupcomponent = () => {
  const [formData, setFormData] = useState({
    userid: '',
    password: '',
    confirmPassword: '',
    email: ''
  });
  const { userid, password, confirmPassword, email } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!formData.userid.trim() || !formData.password.trim() || !formData.email.trim()) {
      alert('모든 필드를 입력해주세요');
      return;
    }
    alert("회원가입이 완료되었습니다");

    setFormData({
      userid: '',
      password: '',
      confirmPassword: '',
      email: ''
    })
  }
  return (
    <div>
      <form onSubmit={handleSubmit} className="signup-box">
        <div>
          <input
            type="text"
            name="userid"
            value={userid}
            onChange={handleChange}
            placeholder="아이디를 입력하세요"
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
            type="password"
            value={confirmPassword}
            name='confirmPassword'
            onChange={handleChange}
            placeholder="비밀번호를 다시 입력하세요"
            className="login-input"
            required
          />
        </div>
        <div>
          <input
            type="password"
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
  )
}

export default Signupcomponent