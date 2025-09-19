import { useState } from 'react';
import { Link } from 'react-router-dom';

function PostManagementPage() {
    const [activeTab, setActiveTab] = useState('user'); // 'project' or 'user'
    const [expandedPost, setExpandedPost] = useState(null);

    // 샘플 데이터
    const posts = [
        {
            id: 1,
            deadline: '25.12.31',
            title: '프론트 파트너 구함',
            description: '리액트/타입스크립트, 디자인 시스템 경험 우대.',
            skills: ['MySQL'],
            applicants: [
                {
                    id: 1,
                    name: 'zlzl',
                    position: '백엔드',
                    rating: 4.4,
                    description: '다 열심히 합니다.'
                },
                {
                    id: 2,
                    name: 'zlzl',
                    position: '백엔드',
                    rating: 4.4,
                    description: '다 열심히 합니다.'
                }
            ]
        }
    ];

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
                    
                    {/* 탭 버튼 */}
                    <div className="flex space-x-2">
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
                </div>

                {/* 공고 목록 */}
                <div className="space-y-6">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {/* 공고 카드 */}
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="text-sm text-gray-500 mb-2">
                                            마감일 : {post.deadline}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {post.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {post.skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col space-y-2 ml-6">
                                        <button
                                            onClick={() => toggleApplicants(post.id)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            지원자
                                        </button>
                                        <div className="flex space-x-2">
                                            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                                                수정
                                            </button>
                                            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 지원자 섹션 */}
                            {expandedPost === post.id && (
                                <div className="bg-gray-50 border-t border-gray-200 p-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                        지원자 {post.applicants.length}명
                                    </h4>
                                    <div className="space-y-4">
                                        {post.applicants.map((applicant) => (
                                            <div key={applicant.id} className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {applicant.name} | {applicant.position} | 별점 {applicant.rating}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {applicant.description}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleApplicantAction(post.id, applicant.id, 'accept')}
                                                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                    >
                                                        수락
                                                    </button>
                                                    <button
                                                        onClick={() => handleApplicantAction(post.id, applicant.id, 'reject')}
                                                        className="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                                    >
                                                        거절
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* 공고가 없을 때 */}
                {posts.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-lg mb-4">등록된 공고가 없습니다.</div>
                        <Link
                            to="/recruitments/new"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            새 공고 등록하기
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PostManagementPage;

