import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { ProjectAPI, UserAPI } from '../../services/api/index';

function ManagementPage() {
    // 세션 스토리지에서 사용자 정보 가져오기
    const getCurrentUser = () => {
        const username = sessionStorage.getItem('username');
        return username ? { username } : null;
    };
  const projectAPI = new ProjectAPI();
  const userAPI = new UserAPI();
    const [activeTab, setActiveTab] = useState('project'); // 'project' or 'user'
    const [expandedPost, setExpandedPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasProjectPosts, setHasProjectPosts] = useState(false);
    const [hasUserPosts, setHasUserPosts] = useState(false);

    // 본인의 공고만 가져오기
    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // 프로젝트 공고 확인
                const allPosts = await projectAPI.getProjects();
                
                const currentUser = getCurrentUser();
                const myProjectPosts = allPosts.filter(post => 
                    post.username === currentUser?.username
                );
                setHasProjectPosts(myProjectPosts.length > 0);
                
                // 유저 프로필 확인
                const allUsers = await userAPI.getUsers();
                const myUserProfiles = allUsers.filter(user => 
                    user.username === currentUser?.username
                );
                setHasUserPosts(myUserProfiles.length > 0);
                
                // 현재 활성 탭에 따라 데이터 설정
                if (activeTab === 'project') {
                    setPosts(myProjectPosts);
                } else {
                    setPosts(myUserProfiles);
                }
            } catch (err) {
                console.error("데이터 불러오기 실패:", err);
                setError("데이터를 불러오는데 실패했습니다.");
                setPosts([]);
                setHasProjectPosts(false);
                setHasUserPosts(false);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchMyPosts();
        }
    }, [currentUser, activeTab]);

    const handleApplicantAction = (postId, applicantId, action) => {
        console.log(`${action} applicant ${applicantId} for post ${postId}`);
        // 실제 구현에서는 API 호출로 처리
    };

    const toggleApplicants = (postId) => {
        setExpandedPost(expandedPost === postId ? null : postId);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container max-w-[1280px] mx-auto px-4 py-8">
                {/* 헤더 */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">내 공고 관리</h1>
                    
                    {/* 로그인 체크 */}
                    {!currentUser ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">로그인이 필요합니다.</p>
                            <Link 
                                to="/login" 
                                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                            >
                                로그인하기
                            </Link>
                        </div>
                    ) : loading ? (
                        <div className="flex justify-center items-center py-8">
                            <LoadingSpinner size="lg" />
                            <span className="ml-3 text-sm text-gray-600">공고를 불러오는 중...</span>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-600 mb-4">{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                            >
                                다시 시도
                            </button>
                        </div>
                    ) : !hasProjectPosts && !hasUserPosts ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">등록된 공고나 프로필이 없습니다.</p>
                        </div>
                    ) : (
                        <>
                            {/* 탭 버튼 - 항상 표시 */}
                            <div className="flex space-x-2 mb-8">
                                <button
                                    onClick={() => setActiveTab('project')}
                                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                        activeTab === 'project'
                                            ? 'bg-gray-800 text-white border-2 border-gray-800'
                                            : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                    프로젝트
                                </button>
                                <button
                                    onClick={() => setActiveTab('user')}
                                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                        activeTab === 'user'
                                            ? 'bg-gray-800 text-white border-2 border-gray-800'
                                            : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                    유저
                                </button>
                            </div>

                            {/* 공고 목록 */}
                            {posts.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-600 mb-4">
                                        {activeTab === 'project' ? '등록된 프로젝트 공고가 없습니다.' : '등록된 유저 프로필이 없습니다.'}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {posts.map((post) => (
                                        <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                            {/* 공고 카드 */}
                                            <div className="p-6">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        {activeTab === 'project' ? (
                                                            // 프로젝트 공고 표시
                                                            <>
                                                                <div className="text-sm text-gray-500 mb-2">
                                                                    마감일 : {post.deadline}
                                                                </div>
                                                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                                                    {post.title}
                                                                </h3>
                                                                <p className="text-gray-600 mb-4">
                                                                    {post.intro}
                                                                </p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {(post.tags || []).map((tag, index) => (
                                                                        <span
                                                                            key={index}
                                                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                                                        >
                                                                            {tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            // 유저 프로필 표시
                                                            <>
                                                                <div className="text-sm text-gray-500 mb-2">
                                                                    등록일 : {new Date(post.createdAt).toLocaleDateString()}
                                                                </div>
                                                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                                                    {post.name || post.username}
                                                                </h3>
                                                                <p className="text-gray-600 mb-4">
                                                                    {post.intro}
                                                                </p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {(post.skills || []).map((skill, index) => (
                                                                        <span
                                                                            key={index}
                                                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                                                        >
                                                                            {skill}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex flex-col space-y-2 ml-6">
                                                        <div className="flex space-x-2">
                                                            {activeTab === 'project' ? (
                                                                // 프로젝트 공고 액션
                                                                <>
                                                                    <Link
                                                                        to={`/project-posts/${post.id}/edit`}
                                                                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                                                    >
                                                                        수정
                                                                    </Link>
                                                                    <Link
                                                                        to={`/project-posts/${post.id}`}
                                                                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                                                    >
                                                                        상세보기
                                                                    </Link>
                                                                </>
                                                            ) : (
                                                                // 유저 프로필 액션
                                                                <>
                                                                    <Link
                                                                        to={`/users/${post.id}/edit`}
                                                                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                                                    >
                                                                        수정
                                                                    </Link>
                                                                    <Link
                                                                        to={`/users/${post.id}`}
                                                                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                                                    >
                                                                        상세보기
                                                                    </Link>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ManagementPage;

