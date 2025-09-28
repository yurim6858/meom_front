import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Navigation() {
    const { user, logout } = useAuth();
    
    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="bg-white/80 dark:text-zinc-100 shadow-md">
            <div className="container max-w-[1280px] mx-auto px-4">
                <div className="flex justify-between items-center py-3">
                    <Link to="/" className="inline-flex items-center">
                        <img src={`${import.meta.env.BASE_URL}image.png`} alt="Logo" className="h-8 w-auto" />
                    </Link>
                    
                    <ul className="flex items-center space-x-4">
                        <li>
                            <Link className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/80" to="/recruitments">프로젝트 탐색</Link>
                        </li>
                        <li>
                            <Link className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/80" to="/recruitments/new">프로젝트 등록</Link>
                        </li>
                        <li>
                            <Link className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/80" to="/users">유저 탐색</Link>
                        </li>
                        <li>
                            <Link className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/80" to="/messages">메시지</Link>
                        </li>
                        <li>
                            <Link className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/80" to="/my-posts">내 공고 관리</Link>
                        </li>
                        {user ? (
                            <li className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    안녕하세요, {user.name}님
                                </span>
                                <button 
                                    onClick={handleLogout}
                                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/80"
                                >
                                    로그아웃
                                </button>
                            </li>
                        ) : (
                            <li>
                                <Link className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/80" to="/login">로그인</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;