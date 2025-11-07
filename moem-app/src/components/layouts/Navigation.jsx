import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import DropdownMenu from '../shared/DropdownMenu';
import MyPageDropdownMenu from '../shared/MyPageDropdownMenu';
import TeamProjectDropdownMenu from '../shared/TeamProjectDropdownMenu';
import AuthAPI from '../../services/api/AuthAPI';

function Navigation() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMyPageDropdownOpen, setIsMyPageDropdownOpen] = useState(false);
  const [isTeamProjectDropdownOpen, setIsTeamProjectDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const myPageDropdownRef = useRef(null);
  const teamProjectDropdownRef = useRef(null);
  const navigate = useNavigate();
  const authAPI = new AuthAPI();
  
  const getCurrentUser = () => {
    return authAPI.getCurrentUser();
  };
  
  const handleLogout = () => {
    authAPI.removeToken();
    navigate('/');
  };

  const openDropdown = () => {
    setIsDropdownOpen(true);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const openMyPageDropdown = () => {
    setIsMyPageDropdownOpen(true);
  };

  const closeMyPageDropdown = () => {
    setIsMyPageDropdownOpen(false);
  };

  const openTeamProjectDropdown = () => {
    setIsTeamProjectDropdownOpen(true);
  };

  const closeTeamProjectDropdown = () => {
    setIsTeamProjectDropdownOpen(false);
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-800 dark:text-zinc-100 shadow-md">
      <div className="container max-w-[1280px] mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link to="/main" className="inline-flex items-center">
            <img src="/image.png" alt="Logo" className="h-8 w-auto" />
          </Link>
          
          <ul className="flex items-center space-x-2 md:space-x-4">
            <li>
              <Link className="nav-link px-4 md:px-10 py-2 rounded-md text-xs md:text-base lg:text-lg font-medium hover:bg-white/80 dark:hover:bg-gray-700 transition-colors" to="/project-posts">
                개인프로젝트
              </Link>
            </li>
            <li 
              className="relative" 
              ref={teamProjectDropdownRef}
              onMouseEnter={openTeamProjectDropdown}
              onMouseLeave={closeTeamProjectDropdown}
            >
              <button className="nav-link px-4 md:px-10 py-2 rounded-md text-xs md:text-base lg:text-lg font-medium hover:bg-white/80 dark:hover:bg-gray-700 transition-colors">
                팀프로젝트
              </button>
              {isTeamProjectDropdownOpen && (
                <TeamProjectDropdownMenu isOpen={isTeamProjectDropdownOpen} onClose={closeTeamProjectDropdown} />
              )}
            </li>
            <li 
              className="relative" 
              ref={dropdownRef}
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
            >
              <button className="nav-link px-4 md:px-10 py-2 rounded-md text-xs md:text-base lg:text-lg font-medium hover:bg-white/80 dark:hover:bg-gray-700 transition-colors">
                매칭
              </button>
              {isDropdownOpen && (
                <DropdownMenu isOpen={isDropdownOpen} onClose={closeDropdown} />
              )}
            </li>
            {(() => {
              const user = getCurrentUser();
              if (!user) return null;
              
              return (
                <li 
                  className="relative" 
                  ref={myPageDropdownRef}
                  onMouseEnter={openMyPageDropdown}
                  onMouseLeave={closeMyPageDropdown}
                >
                  <button className="nav-link px-4 md:px-10 py-2 rounded-md text-xs md:text-base lg:text-lg font-medium hover:bg-white/80 dark:hover:bg-gray-700 transition-colors">
                    마이페이지
                  </button>
                  {isMyPageDropdownOpen && (
                    <MyPageDropdownMenu isOpen={isMyPageDropdownOpen} onClose={closeMyPageDropdown} />
                  )}
                </li>
              );
            })()}
            <li>
              <Link className="nav-link px-4 md:px-10 py-2 rounded-md text-xs md:text-base lg:text-lg font-medium hover:bg-white/80 dark:hover:bg-gray-700 transition-colors" to="/auth-users">
                Auth 사용자
              </Link>
            </li>
            {(() => {
              const user = getCurrentUser();
              return user ? (
                <li className="flex items-center space-x-2">
                  <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    안녕하세요, {user.username}님
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="px-2 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium hover:bg-white/80 dark:hover:bg-gray-700 transition-colors"
                  >
                    로그아웃
                  </button>
                </li>
              ) : (
                <li>
                  <Link className="px-2 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium hover:bg-white/80 dark:hover:bg-gray-700 transition-colors" to="/login">
                    로그인
                  </Link>
                </li>
              );
            })()}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
