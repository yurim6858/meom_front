import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import apiService from '../services/api/index';
import AuthAPI from '../services/api/AuthAPI';

// 달력 컴포넌트
const CalendarComponent = ({ assignments = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // 특정 날짜의 과제 가져오기
  const getAssignmentsForDate = (date) => {
    if (!assignments || assignments.length === 0) return [];
    const dateStr = new Date(year, month, date).toISOString().split('T')[0];
    return assignments.filter(assignment => {
      if (!assignment.dueAt) return false;
      const dueDate = new Date(assignment.dueAt).toISOString().split('T')[0];
      return dueDate === dateStr;
    });
  };
  
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
        {days.map((day, index) => {
          const dayAssignments = day.isCurrentMonth ? getAssignmentsForDate(day.date) : [];
          const totalCount = dayAssignments.length;
          
          return (
            <div
              key={index}
              className={`
                aspect-square flex flex-col items-center justify-start p-1 text-sm rounded transition-colors relative
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
              <span className="text-xs font-medium">{day.date}</span>
              {day.isCurrentMonth && totalCount > 0 && (
                <div className="mt-1 flex flex-col gap-0.5 w-full">
                  {dayAssignments.slice(0, 2).map((assignment, idx) => (
                    <div
                      key={assignment.id || idx}
                      className={`text-[10px] px-1 py-0.5 rounded truncate ${
                        assignment.status === 'COMPLETED'
                          ? 'bg-green-500 text-white'
                          : assignment.status === 'IN_PROGRESS'
                          ? 'bg-blue-500 text-white'
                          : assignment.status === 'DELAYED'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-400 text-white'
                      }`}
                      title={assignment.title}
                    >
                      {assignment.title}
                    </div>
                  ))}
                  {totalCount > 2 && (
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 text-center">
                      +{totalCount - 2}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
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
  const [generatingFullSchedule, setGeneratingFullSchedule] = useState(false);
  const [generationProgress, setGenerationProgress] = useState({ step: '', progress: 0 });
  const [weeklyReports, setWeeklyReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [projectStartDate, setProjectStartDate] = useState('');
  const [projectEndDate, setProjectEndDate] = useState('');
  const [updatingPeriod, setUpdatingPeriod] = useState(false);
  const [showEndDateModal, setShowEndDateModal] = useState(false);
  const [tempEndDate, setTempEndDate] = useState('');
  const [projectWeeks, setProjectWeeks] = useState(''); // 주 단위로 변경
  const [pendingAction, setPendingAction] = useState(null); // 'fullSchedule'

  useEffect(() => {
    loadProjectData();
  }, [id]);

  useEffect(() => {
    if (project && activeMenu === 'tasks') {
      loadAssignments();
    }
    if (project && activeMenu === 'evaluation') {
      loadWeeklyReports();
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
      
      // 프로젝트 기간 설정
      if (foundProject.projectStartDate) {
        const startDate = new Date(foundProject.projectStartDate);
        setProjectStartDate(startDate.toISOString().split('T')[0]);
      }
      if (foundProject.projectEndDate) {
        const endDate = new Date(foundProject.projectEndDate);
        setProjectEndDate(endDate.toISOString().split('T')[0]);
      }

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

  const handleGenerateFullScheduleWithAI = async () => {
    if (!project) return;

    // 종료일 체크
    if (!project.projectEndDate) {
      setProjectWeeks('');
      setPendingAction('fullSchedule');
      setShowEndDateModal(true);
      return;
    }

    const confirmed = window.confirm(
      'AI를 사용하여 프로젝트 전체 스케줄을 자동 생성하시겠습니까?\n\n' +
      '프로젝트 타입별 템플릿과 주차별 스케줄링을 활용하여 전체 기간의 과제가 생성됩니다.\n' +
      '전체 과제와 포지션별 개인 과제가 모두 생성됩니다.\n' +
      '이 작업은 시간이 걸릴 수 있습니다.\n\n' +
      `프로젝트 종료일: ${formatDate(project.projectEndDate)}\n` +
      '계속하시겠습니까?'
    );

    if (!confirmed) return;

    try {
      setGeneratingFullSchedule(true);
      setGenerationProgress({ step: '프로젝트 분석 중...', progress: 10 });
      
      let progressInterval = null;
      
      try {
        // 진행률 시뮬레이션 (실제 API 응답 전까지)
        progressInterval = setInterval(() => {
          setGenerationProgress(prev => {
            // 90% 이전: 단계별 진행
            if (prev.progress < 90) {
              const steps = [
                { step: '프로젝트 분석 중...', progress: 20 },
                { step: '템플릿 생성 중...', progress: 35 },
                { step: '주차별 스케줄링 중...', progress: 50 },
                { step: '과제 생성 중...', progress: 70 },
                { step: '최종 검토 중...', progress: 85 }
              ];
              const nextStep = steps.find(s => s.progress > prev.progress);
              return nextStep || { step: '거의 완료...', progress: Math.min(prev.progress + 2, 90) };
            }
            // 90% 이후: 천천히 증가 (최대 98%까지)
            else if (prev.progress < 98) {
              return { step: '거의 완료...', progress: Math.min(prev.progress + 1, 98) };
            }
            // 98% 이상: 유지
            return prev;
          });
        }, 2000);

        const generatedAssignments = await apiService.assignments.generateFullScheduleWithAI(project.id);
        
        if (progressInterval) clearInterval(progressInterval);
        setGenerationProgress({ step: '완료!', progress: 100 });
        
        // 100%를 2초간 표시한 후 완료 처리
        setTimeout(() => {
          alert(`전체 스케줄 생성 완료! ${generatedAssignments.length}개의 과제가 생성되었습니다.`);
          setGenerationProgress({ step: '', progress: 0 });
          loadAssignments();
        }, 2000);
      } catch (apiErr) {
        if (progressInterval) clearInterval(progressInterval);
        throw apiErr;
      }
    } catch (err) {
      console.error('AI 전체 스케줄 생성 실패:', err);
      console.error('에러 상세 정보:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: err.config
      });
      
      // 타임아웃 에러 처리
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        alert(
          '요청 시간이 초과되었습니다.\n\n' +
          'AI 전체 스케줄 생성은 시간이 오래 걸릴 수 있습니다.\n' +
          '서버에서 작업이 진행 중일 수 있으니 잠시 후 과제 목록을 확인해주세요.\n\n' +
          '또는 프로젝트 기간을 짧게 설정하거나 다시 시도해주세요.'
        );
      } else if (err.response?.status === 503) {
        const errorMessage = err.response?.data?.message || 'AI 서비스가 사용할 수 없습니다.';
        alert(`AI 서비스 사용 불가\n\n${errorMessage}\n\nGemini API 키를 설정해주세요.`);
      } else if (err.response?.status === 404) {
        const errorMessage = err.response?.data?.message || '프로젝트를 찾을 수 없습니다.';
        alert(`프로젝트를 찾을 수 없습니다.\n\n${errorMessage}`);
      } else if (err.response?.status === 400) {
        const errorMessage = err.response?.data?.message || err.response?.data?.error || '잘못된 요청입니다.';
        alert(`잘못된 요청입니다.\n\n${errorMessage}\n\n프로젝트 종료일이 설정되어 있는지 확인해주세요.`);
      } else if (err.response?.status >= 500) {
        const errorMessage = err.response?.data?.message || '서버 오류가 발생했습니다.';
        alert(`서버 오류\n\n${errorMessage}\n\n잠시 후 다시 시도해주세요.`);
      } else {
        // 기타 에러
        const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'AI 전체 스케줄 생성에 실패했습니다.';
        const statusInfo = err.response?.status ? `\n상태 코드: ${err.response.status}` : '';
        alert(`전체 스케줄 생성에 실패했습니다.\n\n${errorMessage}${statusInfo}`);
      }
    } finally {
      setGeneratingFullSchedule(false);
      setGenerationProgress({ step: '', progress: 0 });
    }
  };

  const loadWeeklyReports = async () => {
    if (!project) return;
    
    try {
      setLoadingReports(true);
      const reports = await apiService.weeklyReports.getByProject(project.id);
      setWeeklyReports(reports || []);
    } catch (err) {
      console.error('주간 리포트 조회 실패:', err);
      setWeeklyReports([]);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleUpdateProjectPeriod = async () => {
    if (!project || !isLeader) return;

    if (!projectStartDate) {
      alert('프로젝트 시작일을 입력해주세요.');
      return;
    }

    if (!projectEndDate) {
      alert('프로젝트 종료일을 입력해주세요.');
      return;
    }

    if (new Date(projectStartDate) >= new Date(projectEndDate)) {
      alert('프로젝트 종료일은 시작일보다 늦어야 합니다.');
      return;
    }

    try {
      setUpdatingPeriod(true);
      const updateData = {
        name: project.name,
        description: project.description || '',
        type: project.type,
        recruitTotal: project.recruitTotal || 0,
        recruitStartDate: project.recruitStartDate || null,
        recruitEndDate: project.recruitEndDate || null,
        projectStartDate: projectStartDate,
        projectEndDate: projectEndDate
      };
      
      const updatedProject = await apiService.projects.updateEntity(project.id, updateData);
      setProject(updatedProject);
      alert('프로젝트 기간이 성공적으로 업데이트되었습니다.');
      // 프로젝트 정보 다시 로드
      loadProjectData();
    } catch (err) {
      console.error('프로젝트 기간 업데이트 실패:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || '알 수 없는 오류가 발생했습니다.';
      alert(`프로젝트 기간 업데이트에 실패했습니다.\n\n에러: ${errorMessage}`);
    } finally {
      setUpdatingPeriod(false);
    }
  };

  const handleSaveEndDateAndProceed = async () => {
    if (!projectWeeks || parseInt(projectWeeks) <= 0) {
      alert('프로젝트 기간(주)을 입력해주세요.');
      return;
    }

    const weeks = parseInt(projectWeeks);
    if (weeks < 1 || weeks > 52) {
      alert('프로젝트 기간은 1주 이상 52주 이하여야 합니다.');
      return;
    }

    // 시작일에서 주를 더해서 종료일 계산
    const startDate = project.projectStartDate ? new Date(project.projectStartDate) : new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (weeks * 7) - 1); // 마지막 날 포함

    try {
      setUpdatingPeriod(true);
      const updateData = {
        name: project.name,
        description: project.description || '',
        type: project.type,
        recruitTotal: project.recruitTotal || 0,
        recruitStartDate: project.recruitStartDate || null,
        recruitEndDate: project.recruitEndDate || null,
        projectStartDate: project.projectStartDate || startDate.toISOString().split('T')[0],
        projectEndDate: endDate.toISOString().split('T')[0]
      };
      
      const updatedProject = await apiService.projects.updateEntity(project.id, updateData);
      setProject(updatedProject);
      
      // 프로젝트 정보 다시 로드
      await loadProjectData();
      
      // 모달 닫기
      setShowEndDateModal(false);
      setProjectWeeks('');
      
      // 저장된 종료일로 확인 후 진행
      const action = pendingAction;
      setPendingAction(null);
      
      const endDateFormatted = endDate.toLocaleDateString('ko-KR');
      
      if (action === 'fullSchedule') {
        const confirmed = window.confirm(
          `프로젝트 기간이 ${weeks}주로 설정되었습니다.\n\n` +
          'AI를 사용하여 프로젝트 전체 스케줄을 자동 생성하시겠습니까?\n\n' +
          '프로젝트 타입별 템플릿과 주차별 스케줄링을 활용하여 전체 기간의 과제가 생성됩니다.\n' +
          '전체 과제와 포지션별 개인 과제가 모두 생성됩니다.\n' +
          '이 작업은 시간이 걸릴 수 있습니다.\n\n' +
          `프로젝트 종료일: ${endDateFormatted}\n` +
          '계속하시겠습니까?'
        );
        
        if (confirmed) {
          try {
            setGeneratingFullSchedule(true);
            setGenerationProgress({ step: '프로젝트 분석 중...', progress: 10 });
            
            let progressInterval = null;
            
            try {
              // 진행률 시뮬레이션 (실제 API 응답 전까지)
              progressInterval = setInterval(() => {
                setGenerationProgress(prev => {
                  // 90% 이전: 단계별 진행
                  if (prev.progress < 90) {
                    const steps = [
                      { step: '프로젝트 분석 중...', progress: 20 },
                      { step: '템플릿 생성 중...', progress: 35 },
                      { step: '주차별 스케줄링 중...', progress: 50 },
                      { step: '과제 생성 중...', progress: 70 },
                      { step: '최종 검토 중...', progress: 85 }
                    ];
                    const nextStep = steps.find(s => s.progress > prev.progress);
                    return nextStep || { step: '거의 완료...', progress: Math.min(prev.progress + 2, 90) };
                  }
                  // 90% 이후: 천천히 증가 (최대 98%까지)
                  else if (prev.progress < 98) {
                    return { step: '거의 완료...', progress: Math.min(prev.progress + 1, 98) };
                  }
                  // 98% 이상: 유지
                  return prev;
                });
              }, 2000);

              const generatedAssignments = await apiService.assignments.generateFullScheduleWithAI(project.id);
              
              if (progressInterval) clearInterval(progressInterval);
              setGenerationProgress({ step: '완료!', progress: 100 });
              
              // 100%를 2초간 표시한 후 완료 처리
              setTimeout(() => {
                alert(`전체 스케줄 생성 완료! ${generatedAssignments.length}개의 과제가 생성되었습니다.`);
                setGenerationProgress({ step: '', progress: 0 });
                loadAssignments();
              }, 2000);
            } catch (apiErr) {
              if (progressInterval) clearInterval(progressInterval);
              throw apiErr;
            }
          } catch (err) {
            console.error('AI 전체 스케줄 생성 실패:', err);
            console.error('에러 상세 정보:', {
              message: err.message,
              status: err.response?.status,
              statusText: err.response?.statusText,
              data: err.response?.data,
              config: err.config
            });
            
            // 타임아웃 에러 처리
            if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
              alert(
                '요청 시간이 초과되었습니다.\n\n' +
                'AI 전체 스케줄 생성은 시간이 오래 걸릴 수 있습니다.\n' +
                '서버에서 작업이 진행 중일 수 있으니 잠시 후 과제 목록을 확인해주세요.\n\n' +
                '또는 프로젝트 기간을 짧게 설정하거나 다시 시도해주세요.'
              );
            } else if (err.response?.status === 503) {
              const errorMessage = err.response?.data?.message || 'AI 서비스가 사용할 수 없습니다.';
              alert(`AI 서비스 사용 불가\n\n${errorMessage}\n\nGemini API 키를 설정해주세요.`);
            } else if (err.response?.status === 404) {
              const errorMessage = err.response?.data?.message || '프로젝트를 찾을 수 없습니다.';
              alert(`프로젝트를 찾을 수 없습니다.\n\n${errorMessage}`);
            } else if (err.response?.status === 400) {
              const errorMessage = err.response?.data?.message || err.response?.data?.error || '잘못된 요청입니다.';
              alert(`잘못된 요청입니다.\n\n${errorMessage}\n\n프로젝트 종료일이 설정되어 있는지 확인해주세요.`);
            } else if (err.response?.status >= 500) {
              const errorMessage = err.response?.data?.message || '서버 오류가 발생했습니다.';
              alert(`서버 오류\n\n${errorMessage}\n\n잠시 후 다시 시도해주세요.`);
            } else {
              const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'AI 전체 스케줄 생성에 실패했습니다.';
              const statusInfo = err.response?.status ? `\n상태 코드: ${err.response.status}` : '';
              alert(`전체 스케줄 생성에 실패했습니다.\n\n${errorMessage}${statusInfo}`);
            }
          } finally {
            setGeneratingFullSchedule(false);
          }
        }
      }
    } catch (err) {
      console.error('프로젝트 종료일 저장 실패:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || '알 수 없는 오류가 발생했습니다.';
      alert(`프로젝트 종료일 저장에 실패했습니다.\n\n에러: ${errorMessage}`);
    } finally {
      setUpdatingPeriod(false);
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
              onClick={() => setActiveMenu('evaluation')}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                activeMenu === 'evaluation'
                  ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              평가
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
                  <div className="flex items-center gap-3 mb-4">
                    {(() => {
                      // 종료일이 있고, 현재 날짜보다 이전이면 종료됨
                      const isEnded = project.projectEndDate && new Date(project.projectEndDate) < new Date();
                      return isEnded ? (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                          종료됨
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                          진행 중
                        </span>
                      );
                    })()}
                  </div>
                  <div className="flex items-center justify-between">
                    {project.projectStartDate && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(project.projectStartDate)}
                      </span>
                    )}
                    {isLeader && (() => {
                      // 종료일이 없거나, 종료일이 미래이면 버튼 표시
                      const isEnded = project.projectEndDate && new Date(project.projectEndDate) < new Date();
                      return !isEnded;
                    })() && (
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={handleGenerateFullScheduleWithAI}
                          disabled={generatingFullSchedule}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm relative"
                        >
                          {generatingFullSchedule ? (
                            <>
                              <LoadingSpinner size="sm" />
                              <span>{generationProgress.step || '전체 스케줄 생성 중...'}</span>
                              {generationProgress.progress > 0 && (
                                <span className="text-xs opacity-75">({generationProgress.progress}%)</span>
                              )}
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              <span>AI로 전체 스케줄 생성</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

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
                  </div>

                  {loadingAssignments ? (
                    <div className="flex justify-center items-center py-12">
                      <LoadingSpinner size="lg" />
                      <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">과제를 불러오는 중...</span>
                    </div>
                  ) : assignments.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <p className="text-sm mb-4">등록된 과제가 없습니다.</p>
                      {isLeader && (() => {
                        // 종료일이 없거나, 종료일이 미래이면 메시지 표시
                        const isEnded = project.projectEndDate && new Date(project.projectEndDate) < new Date();
                        return !isEnded;
                      })() && (
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
                                {assignment.status && (
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    assignment.status === 'COMPLETED' 
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                      : assignment.status === 'IN_PROGRESS'
                                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                      : assignment.status === 'DELAYED'
                                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                  }`}>
                                    {assignment.status === 'COMPLETED' ? '완료' :
                                     assignment.status === 'IN_PROGRESS' ? '진행 중' :
                                     assignment.status === 'DELAYED' ? '지연' : '할 일'}
                                  </span>
                                )}
                                {assignment.progress !== null && assignment.progress !== undefined && (
                                  <span className="text-xs">진행률: {assignment.progress}%</span>
                                )}
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
                  </div>
                  
                  {/* 달력 컴포넌트 */}
                  <CalendarComponent assignments={assignments} />
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

            {activeMenu === 'evaluation' && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">주간 평가 리포트</h2>
                  
                  {loadingReports ? (
                    <div className="flex justify-center items-center py-12">
                      <LoadingSpinner size="lg" />
                      <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">리포트를 불러오는 중...</span>
                    </div>
                  ) : weeklyReports.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <p className="text-sm mb-4">생성된 주간 리포트가 없습니다.</p>
                      <p className="text-xs">매주 월요일 오전 9시에 자동으로 리포트가 생성됩니다.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {weeklyReports.map((report) => (
                        <div
                          key={report.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {report.weekNumber}주차 리포트
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(report.weekStartDate).toLocaleDateString('ko-KR')} ~ {new Date(report.weekEndDate).toLocaleDateString('ko-KR')}
                              </p>
                            </div>
                          </div>

                          {report.performanceData && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">성과 지표</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">전체 과제</span>
                                  <p className="font-semibold text-gray-900 dark:text-white">{report.performanceData.totalAssignments || 0}개</p>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">완료</span>
                                  <p className="font-semibold text-green-600 dark:text-green-400">{report.performanceData.completedAssignments || 0}개</p>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">진행 중</span>
                                  <p className="font-semibold text-blue-600 dark:text-blue-400">{report.performanceData.inProgressAssignments || 0}개</p>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">지연</span>
                                  <p className="font-semibold text-red-600 dark:text-red-400">{report.performanceData.delayedAssignments || 0}개</p>
                                </div>
                                <div className="col-span-2 md:col-span-4">
                                  <span className="text-gray-500 dark:text-gray-400">완료율</span>
                                  <p className="font-semibold text-gray-900 dark:text-white">{report.performanceData.completionRate || 0}%</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {report.aiAnalysis && (
                            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI 분석</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                {report.aiAnalysis}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeMenu === 'settings' && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">설정</h2>
                  <div className="space-y-6">
                    {/* 프로젝트 기간 설정 */}
                    {isLeader && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">프로젝트 기간</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              프로젝트 시작일 *
                            </label>
                            <input
                              type="date"
                              value={projectStartDate}
                              onChange={(e) => setProjectStartDate(e.target.value)}
                              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              프로젝트 종료일 *
                            </label>
                            <input
                              type="date"
                              value={projectEndDate}
                              onChange={(e) => setProjectEndDate(e.target.value)}
                              min={projectStartDate || undefined}
                              readOnly={!!project.projectEndDate}
                              className={`w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                                project.projectEndDate ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : ''
                              }`}
                            />
                            {project.projectEndDate && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                종료일은 변경할 수 없습니다.
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={handleUpdateProjectPeriod}
                          disabled={updatingPeriod || !projectStartDate || !projectEndDate}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {updatingPeriod ? (
                            <>
                              <LoadingSpinner size="sm" />
                              <span>저장 중...</span>
                            </>
                          ) : (
                            <span>프로젝트 기간 저장</span>
                          )}
                        </button>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          * 프로젝트 기간을 설정하면 AI가 전체 스케줄을 생성할 때 이 기간을 기준으로 주차별 과제를 생성합니다.
                        </p>
                      </div>
                    )}
                    
                    {/* 프로젝트 종료 */}
                    {isLeader && (() => {
                      // 종료일이 없거나, 종료일이 미래이면 종료 버튼 표시
                      const isEnded = project.projectEndDate && new Date(project.projectEndDate) < new Date();
                      return !isEnded;
                    })() && (
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
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
                      </div>
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

      {/* 종료일 입력 모달 */}
      {showEndDateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              프로젝트 기간 설정
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              AI 스케줄 생성을 위해 프로젝트를 몇 주 동안 진행할지 입력해주세요.
              <br />
              프로젝트 기간은 한 번 설정하면 변경할 수 없습니다.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                프로젝트 기간 (주) *
              </label>
              <input
                type="number"
                value={projectWeeks}
                onChange={(e) => setProjectWeeks(e.target.value)}
                min="1"
                max="52"
                placeholder="예: 12"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {project?.projectStartDate && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  시작일: {formatDate(project.projectStartDate)}
                  {projectWeeks && parseInt(projectWeeks) > 0 && (
                    <span className="ml-2">
                      → 종료일: {(() => {
                        const startDate = new Date(project.projectStartDate);
                        const endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + (parseInt(projectWeeks) * 7) - 1);
                        return endDate.toLocaleDateString('ko-KR');
                      })()}
                    </span>
                  )}
                </p>
              )}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowEndDateModal(false);
                  setProjectWeeks('');
                  setPendingAction(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSaveEndDateAndProceed}
                disabled={!projectWeeks || parseInt(projectWeeks) <= 0 || updatingPeriod}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {updatingPeriod ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>저장 중...</span>
                  </>
                ) : (
                  <span>저장하고 계속</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

