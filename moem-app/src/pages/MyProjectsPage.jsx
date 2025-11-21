import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import apiService from '../services/api/index';

export default function MyProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMyProjects();
  }, []);

  const loadMyProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.projects.getMy();
      setProjects(data);
    } catch (err) {
      console.error('내 프로젝트 목록 조회 실패:', err);
      setError('내 프로젝트 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
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
            <span className="ml-3 text-sm text-zinc-600 dark:text-zinc-400">내 프로젝트 목록을 불러오는 중...</span>
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
              onClick={loadMyProjects}
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
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">내 프로젝트</h1>
          <p className="text-gray-600 dark:text-gray-400">진행 중인 프로젝트를 확인하고 관리하세요.</p>
        </div>

        {/* 프로젝트 갤러리 */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-500 dark:text-gray-400 mb-4">
              <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">진행 중인 프로젝트가 없습니다</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              팀이 프로젝트를 시작하면 여기에서 확인하고 관리할 수 있습니다.
            </p>
            <button
              onClick={() => navigate('/my-teams')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              내 팀 보기
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                진행 중인 프로젝트 ({projects.length}개)
              </h2>
            </div>

            {/* 갤러리 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => {
                // 각 카드마다 약간씩 다른 색상 적용
                const colorVariants = [
                  {
                    gradient: 'from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30',
                    button: 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800'
                  },
                  {
                    gradient: 'from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/30 dark:via-teal-900/30 dark:to-cyan-900/30',
                    button: 'bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800'
                  },
                  {
                    gradient: 'from-amber-50 via-orange-50 to-rose-50 dark:from-amber-900/30 dark:via-orange-900/30 dark:to-rose-900/30',
                    button: 'bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800'
                  },
                  {
                    gradient: 'from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-900/30 dark:via-purple-900/30 dark:to-fuchsia-900/30',
                    button: 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800'
                  },
                  {
                    gradient: 'from-sky-50 via-blue-50 to-indigo-50 dark:from-sky-900/30 dark:via-blue-900/30 dark:to-indigo-900/30',
                    button: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                  },
                  {
                    gradient: 'from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30',
                    button: 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800'
                  },
                ];
                const colorVariant = colorVariants[index % colorVariants.length];
                
                return (
                <div
                  key={project.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                  onClick={() => navigate(`/projects/${project.id}/manage`)}
                >
                  {/* 프로젝트 썸네일/헤더 영역 */}
                  <div className={`relative h-48 bg-gradient-to-br ${colorVariant.gradient}`}>
                    <div className="absolute top-4 right-4">
                      {(() => {
                        // 종료일이 있고, 현재 날짜보다 이전이면 종료됨
                        const isEnded = project.projectEndDate && new Date(project.projectEndDate) < new Date();
                        return isEnded ? (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-600/80 text-white backdrop-blur-sm">
                            종료됨
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/80 text-white backdrop-blur-sm">
                            진행 중
                          </span>
                        );
                      })()}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1 line-clamp-2">
                        {project.name || project.title}
                      </h3>
                    </div>
                  </div>

                  {/* 프로젝트 정보 영역 */}
                  <div className="p-6">
                    {project.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    <div className="space-y-2 mb-4">
                      {project.projectStartDate && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>시작: {formatDate(project.projectStartDate)}</span>
                        </div>
                      )}
                      {project.projectEndDate && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>종료: {formatDate(project.projectEndDate)}</span>
                        </div>
                      )}
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/projects/${project.id}/manage`);
                        }}
                        className={`flex-1 px-4 py-2 ${colorVariant.button} text-white text-sm font-medium rounded-lg transition-colors`}
                      >
                        관리
                      </button>
                      {project.teamId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/teams/${project.teamId}`);
                          }}
                          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors"
                        >
                          팀
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
