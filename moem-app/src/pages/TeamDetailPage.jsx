import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import apiService from '../services/api/index';
import AuthAPI from '../services/api/AuthAPI';

export default function TeamDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teamInfo, setTeamInfo] = useState(null);
  const [startReady, setStartReady] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [starting, setStarting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLeader, setIsLeader] = useState(false);

  useEffect(() => {
    if (id) {
      loadTeamInfo();
    }
  }, [id]);

  useEffect(() => {
    // 현재 사용자 정보 가져오기
    const authAPI = new AuthAPI();
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (teamInfo?.projectId) {
      loadStartReady();
    }
  }, [teamInfo]);

  useEffect(() => {
    // 팀 정보가 로드되면 현재 사용자가 리더인지 확인
    if (teamInfo && currentUser) {
      console.log('=== 리더 확인 디버깅 ===');
      console.log('현재 사용자:', currentUser);
      console.log('팀 멤버들:', teamInfo.members);
      
      const leaderMember = teamInfo.members?.find(member => member.role === 'Leader');
      console.log('리더 멤버:', leaderMember);
      
      const isCurrentUserLeader = leaderMember && leaderMember.name === currentUser.username;
      console.log('현재 사용자가 리더인가?', isCurrentUserLeader);
      console.log('리더 사용자명:', leaderMember?.name);
      console.log('현재 사용자명:', currentUser.username);
      
      setIsLeader(isCurrentUserLeader);
    }
  }, [teamInfo, currentUser]);

  const loadTeamInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.teams.getTeamInfo(id);
      setTeamInfo(data);
    } catch (err) {
      console.error('팀 정보 조회 실패:', err);
      setError('팀 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadStartReady = async () => {
    try {
      // 팀 정보에서 프로젝트 ID를 가져와서 사용
      if (teamInfo?.projectId) {
        const data = await apiService.teams.checkStartReady(id, teamInfo.projectId);
        setStartReady(data);
      } else {
        console.log('팀과 연결된 프로젝트가 없습니다.');
      }
    } catch (err) {
      console.error('시작 준비 상태 조회 실패:', err);
      // 에러가 발생해도 메인 기능에는 영향 없음
    }
  };

  const handleStartProject = async () => {
    if (!startReady?.isReadyToStart || !teamInfo?.projectId) return;
    
    try {
      setStarting(true);
      await apiService.teams.startProject(id, teamInfo.projectId);
      alert('프로젝트가 성공적으로 시작되었습니다!');
      // 프로젝트 관리 페이지로 이동 (향후 구현)
      // navigate(`/projects/${teamInfo.projectId}/manage`);
    } catch (err) {
      console.error('프로젝트 시작 실패:', err);
      alert('프로젝트 시작에 실패했습니다: ' + (err.response?.data || err.message));
    } finally {
      setStarting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <section className="scroll-mt-[72px]">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="flex justify-center items-center">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-sm text-zinc-600 dark:text-zinc-400">팀 정보를 불러오는 중...</span>
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
              onClick={loadTeamInfo}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              다시 시도
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!teamInfo) {
    return (
      <section className="scroll-mt-[72px]">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-xl font-semibold">팀을 찾을 수 없습니다.</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            주소를 확인하거나 목록으로 돌아가세요.
          </p>
          <button
            onClick={() => navigate('/my-teams')}
            className="mt-6 rounded-lg border border-black/10 px-4 py-2 text-sm hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-zinc-800"
          >
            ← 내 팀으로
          </button>
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
            onClick={() => navigate('/my-teams')}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            내 팀으로 돌아가기
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 팀 헤더 카드 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                      {teamInfo.name}
                    </h1>
                    {teamInfo.description && (
                      <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        {teamInfo.description}
                      </p>
                    )}
                  </div>
                  <div className="ml-6 flex flex-col items-end gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {teamInfo.totalMembers}명
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      생성일: {formatDate(teamInfo.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 프로젝트 시작 준비 상태 카드 */}
            {startReady && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">프로젝트 시작 준비</h2>
                  
                  <div className={`p-6 rounded-lg border-2 ${
                    startReady.isReadyToStart 
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                      : 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-lg font-semibold ${
                        startReady.isReadyToStart 
                          ? 'text-green-800 dark:text-green-200' 
                          : 'text-yellow-800 dark:text-yellow-200'
                      }`}>
                        {startReady.isReadyToStart ? '🚀 시작 준비 완료!' : '⏳ 포지션 모집 중'}
                      </h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        startReady.isReadyToStart 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {startReady.completionRate.toFixed(1)}%
                      </div>
                    </div>
                    
                    <p className={`text-sm mb-4 ${
                      startReady.isReadyToStart 
                        ? 'text-green-700 dark:text-green-300' 
                        : 'text-yellow-700 dark:text-yellow-300'
                    }`}>
                      {startReady.message}
                    </p>
                    
                    {/* 포지션 현황 */}
                    <div className="space-y-3 mb-6">
                      {startReady.positionStatuses.map((position, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              position.isFilled 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                              {position.isFilled ? '✓' : '○'}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">{position.role}</span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {position.current}/{position.required}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* 시작하기 버튼 - 리더만 볼 수 있음 */}
                    {(() => {
                      console.log('=== 버튼 렌더링 디버깅 ===');
                      console.log('startReady:', startReady);
                      console.log('isReadyToStart:', startReady?.isReadyToStart);
                      console.log('isLeader:', isLeader);
                      console.log('버튼 표시 조건:', startReady?.isReadyToStart && isLeader);
                      
                      return startReady?.isReadyToStart && isLeader;
                    })() && (
                      <button
                        onClick={handleStartProject}
                        disabled={starting}
                        className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        {starting ? (
                          <>
                            <LoadingSpinner size="sm" />
                            <span>시작 중...</span>
                          </>
                        ) : (
                          <>
                            <span>🚀</span>
                            <span>프로젝트 시작하기</span>
                          </>
                        )}
                      </button>
                    )}
                    
                    {/* 리더가 아닌 경우 메시지 표시 */}
                    {startReady?.isReadyToStart && !isLeader && (
                      <div className="w-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium py-3 px-6 rounded-lg text-center">
                        팀 리더만 프로젝트를 시작할 수 있습니다
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 팀 멤버 카드 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">팀 멤버</h2>
                
                {teamInfo.members && teamInfo.members.length > 0 ? (
                  <div className="space-y-4">
                    {teamInfo.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            member.status === 'Active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                          }`}>
                            {member.status}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(member.CreatedAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-500 dark:text-gray-400 mb-4">
                      <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">팀 멤버가 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 팀 통계 카드 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">팀 통계</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">총 멤버</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {teamInfo.totalMembers}명
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">팀 생성일</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatDate(teamInfo.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">마지막 업데이트</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatDate(teamInfo.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 액션 버튼 카드 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">팀 관리</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate(`/teams/${id}/edit`)}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    팀 정보 수정
                  </button>
                  <button
                    onClick={() => navigate(`/teams/${id}/members`)}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    멤버 관리
                  </button>
                  <button
                    onClick={() => navigate(`/teams/${id}/invitations`)}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    초대 관리
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

