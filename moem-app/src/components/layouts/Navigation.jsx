import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <nav className="bg-gray-800 text-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-3">
                    <Link className="text-xl font-bold hover:text-gray-300" to="/">Logo</Link>
                    
                    <ul className="flex items-center space-x-4">
                        <li>
                            <Link className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700" to="#">게시판</Link>
                        </li>
                        <li>
                            <Link className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700" to="#">AI 챗봇</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;