import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationAPI } from '../services/api/index';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const applicationAPI = useMemo(() => new ApplicationAPI(), []);

  // localStorage에서 사용자 정보 가져오기
  const getCurrentUser = () => {
    const username = localStorage.getItem('username');
    return username ? { username } : null;
  };

  const currentUser = useMemo(() => getCurrentUser(), []);

  useEffect(() => {
    if (!currentUser?.username) {
      setError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    loadApplications();
  }, [currentUser]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await applicationAPI.getApplicationsByUser(currentUser.username);
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('지원 목록 조회 실패:', err);
      setError('지원 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { text: '대기중', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
      APPROVED: { text: '승인됨', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      REJECTED: { text: '거절됨', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
      WITHDRAWN: { text: '취소됨', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleWithdraw = async (applicationId) => {
    if (!confirm('정말로 이 지원을 취소하시겠습니까?')) {
      return;
    }

    try {
      await applicationAPI.deleteApplication(applicationId, currentUser.username);
      alert('지원이 취소되었습니다.');
      loadApplications();
    } catch (error) {
      console.error('지원 취소 실패:', error);
      alert('지원 취소에 실패했습니다.');
    }
  };

  // 상태별로 그룹화
  const groupedApplications = useMemo(() => {
    const groups = {
      PENDING: [],
      APPROVED: [],
      REJECTED: [],
      WITHDRAWN: []
    };

    applications.forEach(app => {
      if (groups[app.status]) {
        groups[app.status].push(app);
      }
    });

    return groups;
  }, [applications]);

  if (loading) {
    return (
      <section className="scroll-mt-[72px]">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="flex justify-center items-center">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-sm text-zinc-600 dark:text-zinc-400">지원 목록을 불러오는 중...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="scroll-mt-[72px]">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            로그인하기
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="scroll-mt-[72px] bg-gray-50 min-h-screen dark:bg-gray-900">
      <div className="container max-w-[1280px] mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-gray-900 dark:text-white">
            내 지원 현황
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            내가 지원한 프로젝트 목록을 확인할 수 있습니다.
          </p>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">전체</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{applications.length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">대기중</div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{groupedApplications.PENDING.length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">승인됨</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{groupedApplications.APPROVED.length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">거절/취소</div>
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {groupedApplications.REJECTED.length + groupedApplications.WITHDRAWN.length}
            </div>
          </div>
        </div>

        {/* 지원 목록 */}
        {applications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">아직 지원한 프로젝트가 없습니다.</p>
            <button
              onClick={() => navigate('/project-posts')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              프로젝트 둘러보기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedApplications).map(([status, apps]) => {
              if (apps.length === 0) return null;

              return (
                <div key={status} className="space-y-3">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {status === 'PENDING' && '대기중'}
                    {status === 'APPROVED' && '승인됨'}
                    {status === 'REJECTED' && '거절됨'}
                    {status === 'WITHDRAWN' && '취소됨'} ({apps.length})
                  </h2>
                  {apps.map((application) => (
                    <div
                      key={application.id}
                      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/project-posts/${application.projectId}`)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            프로젝트 ID: {application.projectId}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(application.status)}
                            {application.appliedPosition && (
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                                {application.appliedPosition}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            지원일: {formatDate(application.appliedAt)}
                          </p>
                        </div>
                      </div>

                      {application.message && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            {application.message}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/project-posts/${application.projectId}`);
                          }}
                          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          프로젝트 보기 →
                        </button>
                        {application.status === 'PENDING' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWithdraw(application.id);
                            }}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                          >
                            지원 취소
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyApplicationsPage;

