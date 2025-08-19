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
                            <Link className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/80" to="/matches">프로젝트 탐색</Link>
                        </li>
                        <li>
                            <Link className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/80" to="/recruitments">프로젝트 등록</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;