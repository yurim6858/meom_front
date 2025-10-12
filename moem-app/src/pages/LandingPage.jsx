import React from 'react'
import logo from '../assets/logo.png'
import poster from '../assets/poster.png'
import { Link } from 'react-router-dom';


const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 네비게이션 */}
      <header className="bg-white shadow-sm">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center">
              <img src={logo} className="h-10 w-auto" alt="Logo" />
            </Link>
            <nav className="flex items-center space-x-6">
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                로그인
              </Link>
              <Link 
                to="/signup"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                회원가입
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <img 
              src={poster} 
              className="max-w-full h-auto mx-auto rounded-lg shadow-lg" 
              alt="Poster"
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default LandingPage
