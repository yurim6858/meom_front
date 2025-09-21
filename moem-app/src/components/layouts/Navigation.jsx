import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <nav className="bg-white/80 dark:text-zinc-100 shadow-md">
            <div className="container max-w-[1280px] mx-auto px-4">
                <div className="flex justify-between items-center py-3">
                    <Link to="/" className="inline-flex items-center">
                        <img src={`${import.meta.env.BASE_URL}image.png`} alt="Logo" className="h-8 w-auto" />
                    </Link>
                    
                    <ul className="flex items-center space-x-4">
                         <li>
                        <Link className="px-10 py-2 rounded-md text-[35px] font-medium hover:bg-white/80" to="/recruitments">개인프로젝트</Link>
                    </li>
                    <li>
                        <Link className="px-10 py-2 rounded-md text-[35px] font-medium hover:bg-white/80" to="/recruitments/new">팀프로젝트</Link>
                    </li>
                    <li>
                        <Link className="px-10 py-2 rounded-md text-[35px] font-medium hover:bg-white/80" to="/recruitments/new">매칭</Link>
                    </li>
                    <li>
                        <Link className="px-10 py-2 rounded-md text-[35px] font-medium hover:bg-white/80" to="/mypage">마이페이지</Link>
                    </li>
                    <li>
                        <Link className="px-10 py-2 rounded-md text-[35px] font-medium hover:bg-white/80" to="/">로그아웃</Link>
                    </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;