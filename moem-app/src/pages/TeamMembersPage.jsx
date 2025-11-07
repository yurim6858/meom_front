import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import apiService from '../services/api/index';
import AuthAPI from '../services/api/AuthAPI';

export default function TeamMembersPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teamInfo, setTeamInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLeader, setIsLeader] = useState(false);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    if (id) {
      loadTeamInfo();
    }
  }, [id]);

  useEffect(() => {
    const authAPI = new AuthAPI();
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (teamInfo && currentUser) {
      const leaderMember = teamInfo.members?.find(member => member.role === 'MANAGER' || member.role === 'Leader');
      const isCurrentUserLeader = leaderMember && leaderMember.username === currentUser.username;
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

  const handleRemoveMember = async (memberId, username) => {
    if (!isLeader) {
      alert('팀 리더만 멤버를 제거할 수 있습니다.');
      return;
    }

    const confirmed = window.confirm(
      `정말로 ${username}님을 팀에서 제거하시겠습니까?`
    );

    if (!confirmed) return;

    try {
      setRemoving(memberId);
      await apiService.teams.removeMember(id, memberId);
      alert('멤버가 성공적으로 제거되었습니다.');
      // 팀 정보 다시 로드 (모집 완료 상태 재계산을 위해)
      await loadTeamInfo();
      // 페이지 새로고침으로 TeamDetailPage의 startReady 상태도 업데이트
      // (또는 TeamDetailPage로 돌아가면 자동으로 업데이트됨)
    } catch (err) {
      console.error('멤버 제거 실패:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || '알 수 없는 오류가 발생했습니다.';
      alert(`멤버 제거에 실패했습니다.\n\n에러: ${errorMessage}`);
    } finally {
      setRemoving(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
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

  if (error || !teamInfo) {
    return (
      <section className="scroll-mt-[72px]">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error || '팀 정보를 찾을 수 없습니다.'}</p>
            <button
              onClick={() => navigate(`/teams/${id}`)}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              팀 상세 페이지로 돌아가기
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="scroll-mt-[72px] bg-gray-50 min-h-screen dark:bg-gray-900">
      <div className="container max-w-[1000px] mx-auto px-4 py-8">
        {/* 상단 네비게이션 */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/teams/${id}`)}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            팀 상세 페이지로 돌아가기
          </button>
        </div>

        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">팀 멤버 관리</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {teamInfo.name}의 멤버를 관리할 수 있습니다.
          </p>
        </div>

        {/* 멤버 목록 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                멤버 목록 ({teamInfo.totalMembers}명)
              </h2>
            </div>

            {teamInfo.members && teamInfo.members.length > 0 ? (
              <div className="space-y-4">
                {teamInfo.members.map((member) => (
                  <div 
                    key={member.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {member.username && member.username.length > 0 
                            ? member.username.charAt(0).toUpperCase() 
                            : '?'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {member.username || '이름 없음'}
                        </h3>
                        <div className="flex items-center space-x-3 mt-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {member.role || 'MEMBER'}
                          </p>
                          {(member.role === 'MANAGER' || member.role === 'Leader') && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                              리더
                            </span>
                          )}
                          {member.email && (
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              {member.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {member.createdAt && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          가입일: {formatDate(member.createdAt)}
                        </span>
                      )}
                      {isLeader && member.role !== 'MANAGER' && member.role !== 'Leader' && (
                        <button
                          onClick={() => handleRemoveMember(member.id, member.username)}
                          disabled={removing === member.id}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          {removing === member.id ? '제거 중...' : '제거'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">멤버가 없습니다</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  팀에 멤버가 없습니다.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 안내 메시지 */}
        {!isLeader && (
          <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              팀 리더만 멤버를 제거할 수 있습니다.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

