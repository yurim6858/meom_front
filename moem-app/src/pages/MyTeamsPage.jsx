import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import apiService from '../services/api/index';

export default function MyTeamsPage() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMyTeams();
  }, []);

  const loadMyTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.teams.getMy();
      // 백엔드에서 이미 프로젝트 시작 전 팀만 필터링하여 반환하므로 그대로 사용
      setTeams(data);
    } catch (err) {
      console.error('내 팀 목록 조회 실패:', err);
      setError('내 팀 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="scroll-mt-[72px]">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="flex justify-center items-center">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-sm text-zinc-600 dark:text-zinc-400">내 팀 목록을 불러오는 중...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="scroll-mt-[72px]">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={loadMyTeams}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              다시 시도
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="scroll-mt-[72px] bg-gray-50 min-h-screen dark:bg-gray-900">
      <div className="container max-w-[1280px] mx-auto px-4 py-8">
        {/* 상단 네비게이션 */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            뒤로 가기
          </button>
        </div>

        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">내 팀</h1>
          <p className="text-gray-600 dark:text-gray-400">내가 속한 팀들을 확인하고 관리하세요.</p>
        </div>

        {/* 팀 목록 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-8">
            {teams.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">프로젝트를 시작하지 않은 팀이 없습니다</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  프로젝트가 시작된 팀은 "내 프로젝트" 페이지에서 관리할 수 있습니다.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => navigate('/project-posts')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    프로젝트 탐색
                  </button>
                  <button
                    onClick={() => navigate('/project-posts/new')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    프로젝트 생성
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    내 팀 ({teams.length}개)
                  </h2>
                </div>

                {teams.map((team) => (
                  <div key={team.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {team.name}
                          </h3>
                        </div>
                        {team.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {team.description}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          생성일: {formatDate(team.CreatedAt)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/teams/${team.id}`)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          상세보기
                        </button>
                      </div>
                    </div>

                    {/* 팀 멤버 미리보기 - 현재는 간단한 정보만 표시 */}
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        팀 상세 정보를 보려면 상세보기를 클릭하세요.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
