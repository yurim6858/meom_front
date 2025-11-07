import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import apiService from '../services/api/index';
import AuthAPI from '../services/api/AuthAPI';

export default function TeamEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teamInfo, setTeamInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLeader, setIsLeader] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    maxMembers: 0
  });

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

      if (teamInfo) {
        setFormData({
          name: teamInfo.name || '',
          maxMembers: teamInfo.maxMembers || 0
        });
      }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxMembers' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLeader) {
      alert('팀 리더만 팀 정보를 수정할 수 있습니다.');
      return;
    }

    if (!formData.name.trim()) {
      alert('팀 이름을 입력해주세요.');
      return;
    }

    if (formData.maxMembers < 1) {
      alert('최대 멤버 수는 1명 이상이어야 합니다.');
      return;
    }

    try {
      setSaving(true);
      await apiService.teams.update(id, formData);
      alert('팀 정보가 성공적으로 수정되었습니다.');
      navigate(`/teams/${id}`);
    } catch (err) {
      console.error('팀 정보 수정 실패:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || '알 수 없는 오류가 발생했습니다.';
      alert(`팀 정보 수정에 실패했습니다.\n\n에러: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
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
              onClick={() => navigate('/my-teams')}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              내 팀으로 돌아가기
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!isLeader) {
    return (
      <section className="scroll-mt-[72px]">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-10 dark:border-yellow-800 dark:bg-yellow-900/20">
            <h1 className="text-xl font-semibold mb-2">권한이 없습니다</h1>
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-4">
              팀 리더만 팀 정보를 수정할 수 있습니다.
            </p>
            <button
              onClick={() => navigate(`/teams/${id}`)}
              className="rounded-lg bg-yellow-600 px-4 py-2 text-sm text-white hover:bg-yellow-700"
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
      <div className="container max-w-[800px] mx-auto px-4 py-8">
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">팀 정보 수정</h1>
          <p className="text-gray-600 dark:text-gray-400">팀 정보를 수정할 수 있습니다.</p>
        </div>

        {/* 수정 폼 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* 팀 이름 */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  팀 이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength={60}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="팀 이름을 입력하세요"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  최대 60자까지 입력 가능합니다.
                </p>
              </div>

              {/* 최대 멤버 수 */}
              <div>
                <label htmlFor="maxMembers" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  최대 멤버 수 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="maxMembers"
                  name="maxMembers"
                  value={formData.maxMembers}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="최대 멤버 수를 입력하세요"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  현재 멤버 수: {teamInfo.totalMembers}명
                </p>
              </div>
            </div>

            {/* 버튼 */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(`/teams/${id}`)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>저장 중...</span>
                  </>
                ) : (
                  <span>저장</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

