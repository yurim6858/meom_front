import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import DropdownMenu from '../shared/DropdownMenu';

function Navigation() {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const openDropdown = () => {
        setIsDropdownOpen(true);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    return (
        <nav className="bg-white/80 dark:text-zinc-100 shadow-md">
            <div className="container max-w-[1280px] mx-auto px-4">
                <div className="flex justify-between items-center py-3">
                    <Link to="/main" className="inline-flex items-center">
                        <img src="/image.png" alt="Logo" className="h-8 w-auto" />
                    </Link>
                    
                    <ul className="flex items-center space-x-2 md:space-x-4">
                        <li>
                            <Link className="nav-link px-4 md:px-10 py-2 rounded-md text-xs md:text-base lg:text-lg font-medium hover:bg-white/80 transition-colors" to="/project-posts">개인프로젝트</Link>
                        </li>
                        <li>
                            <Link className="nav-link px-4 md:px-10 py-2 rounded-md text-xs md:text-base lg:text-lg font-medium hover:bg-white/80 transition-colors" to="/project-posts/new">팀프로젝트</Link>
                        </li>
                        <li 
                            className="relative" 
                            ref={dropdownRef}
                            onMouseEnter={openDropdown}
                            onMouseLeave={closeDropdown}
                        >
                            <button 
                                className="nav-link px-4 md:px-10 py-2 rounded-md text-xs md:text-base lg:text-lg font-medium hover:bg-white/80 transition-colors"
                            >
                                매칭
                            </button>
                            <DropdownMenu isOpen={isDropdownOpen} onClose={closeDropdown} />
                        </li>
                        <li>
                            <Link className="nav-link px-4 md:px-10 py-2 rounded-md text-xs md:text-base lg:text-lg font-medium hover:bg-white/80 transition-colors" to="/mypage">마이페이지</Link>
                        </li>
                        <li>
                            <Link className="nav-link px-4 md:px-10 py-2 rounded-md text-xs md:text-base lg:text-lg font-medium hover:bg-white/80 transition-colors" to="/auth-users">Auth 사용자</Link>
                        </li>
                        {user ? (
                            <li className="flex items-center space-x-2">
                                <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                                    안녕하세요, {user.username}님
                                </span>
                                <button 
                                    onClick={handleLogout}
                                    className="px-2 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium hover:bg-white/80 transition-colors"
                                >
                                    로그아웃
                                </button>
                            </li>
                        ) : (
                            <li>
                                <Link className="px-2 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium hover:bg-white/80 transition-colors" to="/login">로그인</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;