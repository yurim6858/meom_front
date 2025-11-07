import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import apiService from '../services/api/index';
import AuthAPI from '../services/api/AuthAPI';

// 달력 컴포넌트
const CalendarComponent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // 이전 달로 이동
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  // 달의 첫 번째 날과 마지막 날
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  // 달력 그리드 생성
  const days = [];
  
  // 이전 달의 마지막 날들 (빈 칸 채우기)
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: prevMonthLastDay - i,
      isCurrentMonth: false,
      isToday: false
    });
  }
  
  // 현재 달의 날들
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: i,
      isCurrentMonth: true,
      isToday: today.getFullYear() === year && today.getMonth() === month && today.getDate() === i
    });
  }
  
  // 다음 달의 첫 날들 (빈 칸 채우기)
  const remainingDays = 42 - days.length; // 6주 * 7일 = 42
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: i,
      isCurrentMonth: false,
      isToday: false
    });
  }
  
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      {/* 달력 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {year}년 {monthNames[month]}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`text-center text-sm font-medium py-2 ${
              index === 0
                ? 'text-red-500 dark:text-red-400'
                : index === 6
                ? 'text-blue-500 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* 달력 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            className={`
              aspect-square flex items-center justify-center text-sm rounded transition-colors
              ${!day.isCurrentMonth
                ? 'text-gray-300 dark:text-gray-600'
                : day.isToday
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
              }
              ${index % 7 === 0 ? 'text-red-500 dark:text-red-400' : ''}
              ${index % 7 === 6 ? 'text-blue-500 dark:text-blue-400' : ''}
            `}
          >
            {day.date}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ProjectManagePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [teamInfo, setTeamInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLeader, setIsLeader] = useState(false);
  const [ending, setEnding] = useState(false);
  const [activeMenu, setActiveMenu] = useState('overview');
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [generatingSchedule, setGeneratingSchedule] = useState(false);

  useEffect(() => {
    loadProjectData();
  }, [id]);

  useEffect(() => {
    if (project && activeMenu === 'tasks') {
      loadAssignments();
    }
  }, [project, activeMenu]);

  useEffect(() => {
    // 현재 사용자 정보 가져오기
    const authAPI = new AuthAPI();
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    // 팀 정보가 로드되면 현재 사용자가 리더인지 확인
    if (teamInfo && currentUser) {
      const leaderMember = teamInfo.members?.find(member => member.role === 'MANAGER' || member.role === 'Leader');
      const isCurrentUserLeader = leaderMember && leaderMember.username === currentUser.username;
      setIsLeader(isCurrentUserLeader);
    }
  }, [teamInfo, currentUser]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      setError(null);

      let foundProject = null;

      // 먼저 개별 프로젝트 조회 API 시도
      try {
        foundProject = await apiService.projects.getStartedProject(id);
      } catch (err) {
        // 404 에러인 경우 전체 목록에서 찾기 (하위 호환성)
        if (err.message === 'NOT_FOUND' || err.response?.status === 404) {
          console.log('개별 프로젝트 조회 API가 없어 전체 목록에서 찾는 중...');
          const myProjects = await apiService.projects.getMy();
          foundProject = myProjects.find(p => p.id === parseInt(id));
        } else {
          throw err;
        }
      }

      if (!foundProject) {
        setError('NOT_FOUND');
        return;
      }

      setProject(foundProject);

      // 프로젝트에 연결된 팀 정보 가져오기
      if (foundProject.teamId) {
        try {
          const team = await apiService.teams.getTeamInfo(foundProject.teamId);
          setTeamInfo(team);
        } catch (err) {
          console.error('팀 정보 조회 실패:', err);
          // 팀 정보가 없어도 프로젝트는 표시
        }
      }
    } catch (err) {
      console.error('프로젝트 정보 조회 실패:', err);
      if (err.message === 'NOT_FOUND') {
        setError('NOT_FOUND');
      } else {
        setError('프로젝트 정보를 불러오는데 실패했습니다: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
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

  const loadAssignments = async () => {
    if (!project) return;
    
    try {
      setLoadingAssignments(true);
      const assignmentsList = await apiService.assignments.getByProject(project.id);
      setAssignments(assignmentsList || []);
    } catch (err) {
      console.error('과제 목록 조회 실패:', err);
      setAssignments([]);
    } finally {
      setLoadingAssignments(false);
    }
  };

  const handleGenerateAssignmentsWithAI = async () => {
    if (!project) return;

    const confirmed = window.confirm(
      'AI를 사용하여 프로젝트 과제를 자동 생성하시겠습니까?\n\n' +
      '프로젝트 정보를 기반으로 적절한 과제들이 생성됩니다.'
    );

    if (!confirmed) return;

    try {
      setGeneratingAI(true);
      const generatedAssignments = await apiService.assignments.generateWithAI(project.id);
      alert(`과제 ${generatedAssignments.length}개가 성공적으로 생성되었습니다.`);
      await loadAssignments();
    } catch (err) {
      console.error('AI 과제 생성 실패:', err);
      const errorMessage = err.response?.data?.message || err.message || 'AI 과제 생성에 실패했습니다.';
      alert(`과제 생성에 실패했습니다.\n\n에러: ${errorMessage}`);
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleGenerateScheduleWithAI = async () => {
    if (!project) return;

    const confirmed = window.confirm(
      'AI를 사용하여 프로젝트 일정을 자동 생성하시겠습니까?\n\n' +
      '프로젝트 정보를 기반으로 주요 마일스톤과 일정이 생성됩니다.'
    );

    if (!confirmed) return;

    try {
      setGeneratingSchedule(true);
      const generatedSchedules = await apiService.assignments.generateScheduleWithAI(project.id);
      alert(`일정 ${generatedSchedules.length}개가 성공적으로 생성되었습니다.`);
      await loadAssignments();
    } catch (err) {
      console.error('AI 일정 생성 실패:', err);
      const errorMessage = err.response?.data?.message || err.message || 'AI 일정 생성에 실패했습니다.';
      alert(`일정 생성에 실패했습니다.\n\n에러: ${errorMessage}`);
    } finally {
      setGeneratingSchedule(false);
    }
  };

  const handleEndProject = async () => {
    if (!project || !isLeader) return;

    // 확인 대화상자
    const confirmed = window.confirm(
      '정말로 프로젝트를 종료하시겠습니까?\n\n' +
      '프로젝트를 종료하면 종료일이 기록되고, 프로젝트 상태가 변경됩니다.'
    );

    if (!confirmed) return;

    try {
      setEnding(true);
      const updatedProject = await apiService.projects.endProject(project.id);
      setProject(updatedProject);
      alert('프로젝트가 성공적으로 종료되었습니다.');
      // 프로젝트 정보 다시 로드
      loadProjectData();
    } catch (err) {
      console.error('프로젝트 종료 실패:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || '알 수 없는 오류가 발생했습니다.';
      alert(`프로젝트 종료에 실패했습니다.\n\n에러: ${errorMessage}`);
    } finally {
      setEnding(false);
    }
  };

  if (loading) {
    return (
      <section className="scroll-mt-[72px]">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="flex justify-center items-center">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-sm text-zinc-600 dark:text-zinc-400">프로젝트 정보를 불러오는 중...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error === 'NOT_FOUND' || !project) {
    return (
      <section className="scroll-mt-[72px]">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 dark:border-red-800 dark:bg-red-900/20">
            <h1 className="text-xl font-semibold mb-2">프로젝트를 찾을 수 없습니다.</h1>
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">
              이 프로젝트에 접근할 권한이 없거나 프로젝트가 존재하지 않습니다.
            </p>
            <button
              onClick={() => navigate('/my-projects')}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              내 프로젝트로 돌아가기
            </button>
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
              onClick={loadProjectData}
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
    <section className="h-[calc(100vh-72px)] bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <div className="flex h-full">
        {/* 왼쪽 사이드바 */}
        <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
          {/* 사용자 프로필 영역 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentUser?.username || 'User'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {currentUser?.email || '@email.com'}
                </div>
              </div>
            </div>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <button
              onClick={() => setActiveMenu('overview')}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                activeMenu === 'overview'
                  ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              개요
            </button>
            <button
              onClick={() => setActiveMenu('tasks')}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                activeMenu === 'tasks'
                  ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              과제
            </button>
            <button
              onClick={() => setActiveMenu('schedule')}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                activeMenu === 'schedule'
                  ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              스케줄
            </button>
            <button
              onClick={() => setActiveMenu('team')}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                activeMenu === 'team'
                  ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              팀
            </button>
            <button
              onClick={() => setActiveMenu('settings')}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                activeMenu === 'settings'
                  ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              설정
            </button>
          </nav>

          {/* 하단 버튼 */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={() => navigate('/my-projects')}
              className="w-full text-left px-3 py-2 rounded text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              ← 내 프로젝트
            </button>
          </div>
        </div>

        {/* 오른쪽 메인 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
          <div className="max-w-4xl mx-auto px-8 py-12">
            {/* 노션 스타일 제목 - 개요에만 표시 */}
            {activeMenu === 'overview' && (
              <>
                <div className="mb-8">
                  <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                    {project.name || project.title || '프로젝트 이름'}
                  </h1>
                  <div className="flex items-center gap-3">
                    {project.projectEndDate ? (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        종료됨
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        진행 중
                      </span>
                    )}
                    {project.projectStartDate && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(project.projectStartDate)}
                      </span>
                    )}
                  </div>
                </div>

                {/* 설명 */}
                {project.description && (
                  <div className="mb-8">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* 메뉴별 콘텐츠 */}
            {activeMenu === 'overview' && (
              <div className="space-y-8">
                {/* 프로젝트 정보 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">프로젝트 정보</h2>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded px-2 -mx-2 transition-colors">
                      <span className="text-sm text-gray-500 dark:text-gray-400 w-24">프로젝트 ID</span>
                      <span className="text-sm text-gray-900 dark:text-white">{project.id}</span>
                    </div>
                    {project.projectStartDate && (
                      <div className="flex items-center gap-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded px-2 -mx-2 transition-colors">
                        <span className="text-sm text-gray-500 dark:text-gray-400 w-24">시작일</span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {formatDate(project.projectStartDate)}
                        </span>
                      </div>
                    )}
                    {project.projectEndDate && (
                      <div className="flex items-center gap-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded px-2 -mx-2 transition-colors">
                        <span className="text-sm text-gray-500 dark:text-gray-400 w-24">종료일</span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {formatDate(project.projectEndDate)}
                        </span>
                      </div>
                    )}
                    {project.createdAt && (
                      <div className="flex items-center gap-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded px-2 -mx-2 transition-colors">
                        <span className="text-sm text-gray-500 dark:text-gray-400 w-24">생성일</span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {formatDate(project.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 팀 멤버 */}
                {teamInfo && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">팀 멤버</h2>
                      {(project.teamId || teamInfo?.id) && (
                        <button
                          onClick={() => navigate(`/teams/${teamInfo?.id || project.teamId}`)}
                          className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
                        >
                          팀 상세 보기 →
                        </button>
                      )}
                    </div>
                    
                    {teamInfo.members && teamInfo.members.length > 0 ? (
                      <div className="space-y-2">
                        {teamInfo.members.map((member) => (
                          <div key={member.id} className="flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded px-2 -mx-2 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                                  {member.username && member.username.length > 0 
                                    ? member.username.charAt(0).toUpperCase() 
                                    : '?'}
                                </span>
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {member.username || '이름 없음'}
                                  </span>
                                  {(member.role === 'MANAGER' || member.role === 'Leader') && (
                                    <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                                      리더
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {member.role || 'MEMBER'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p className="text-sm">팀 멤버가 없습니다.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeMenu === 'tasks' && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">과제</h2>
                    {isLeader && !project.projectEndDate && (
                      <button
                        onClick={handleGenerateAssignmentsWithAI}
                        disabled={generatingAI}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                      >
                        {generatingAI ? (
                          <>
                            <LoadingSpinner size="sm" />
                            <span>AI 생성 중...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>AI로 과제 생성</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {loadingAssignments ? (
                    <div className="flex justify-center items-center py-12">
                      <LoadingSpinner size="lg" />
                      <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">과제를 불러오는 중...</span>
                    </div>
                  ) : assignments.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <p className="text-sm mb-4">등록된 과제가 없습니다.</p>
                      {isLeader && !project.projectEndDate && (
                        <p className="text-xs">AI를 사용하여 과제를 자동 생성할 수 있습니다.</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {assignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                {assignment.title}
                              </h3>
                              {assignment.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                  {assignment.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                <span>담당자 ID: {assignment.userId}</span>
                                <span>마감일: {formatDate(assignment.dueAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeMenu === 'schedule' && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">스케줄</h2>
                    {isLeader && !project.projectEndDate && (
                      <button
                        onClick={handleGenerateScheduleWithAI}
                        disabled={generatingSchedule}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                      >
                        {generatingSchedule ? (
                          <>
                            <LoadingSpinner size="sm" />
                            <span>AI 생성 중...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>AI로 일정 생성</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  
                  {/* 달력 컴포넌트 */}
                  <CalendarComponent />
                </div>
              </div>
            )}

            {activeMenu === 'team' && teamInfo && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">팀 관리</h2>
                  <div className="space-y-4">
                  {(project.teamId || teamInfo?.id) && (
                    <>
                      <button
                        onClick={() => navigate(`/teams/${teamInfo?.id || project.teamId}`)}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded transition-colors border border-gray-200 dark:border-gray-800"
                      >
                        팀 상세 보기
                      </button>
                      <button
                        onClick={() => navigate(`/teams/${teamInfo?.id || project.teamId}/edit`)}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded transition-colors border border-gray-200 dark:border-gray-800"
                      >
                        팀 정보 수정
                      </button>
                      <button
                        onClick={() => navigate(`/teams/${teamInfo?.id || project.teamId}/members`)}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded transition-colors border border-gray-200 dark:border-gray-800"
                      >
                        멤버 관리
                      </button>
                    </>
                  )}
                  </div>
                </div>
              </div>
            )}

            {activeMenu === 'settings' && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">설정</h2>
                  <div className="space-y-4">
                  {isLeader && !project.projectEndDate && (
                    <button
                      onClick={handleEndProject}
                      disabled={ending}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors border border-red-200 dark:border-red-800 disabled:opacity-50 flex items-center gap-2"
                    >
                      {ending ? (
                        <>
                          <LoadingSpinner size="sm" />
                          <span>종료 중...</span>
                        </>
                      ) : (
                        <span>프로젝트 종료</span>
                      )}
                    </button>
                  )}
                  {project.projectEndDate && (
                    <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded">
                      종료됨: {formatDate(project.projectEndDate)}
                    </div>
                  )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}

