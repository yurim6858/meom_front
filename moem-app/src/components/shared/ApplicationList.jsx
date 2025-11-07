import React, { useState, useEffect } from 'react';
import { ApplicationAPI } from '../../services/api/index';
import apiService from '../../services/api/index';

const ApplicationList = ({ projectId, isOwner }) => {
  const [applications, setApplications] = useState([]);
  const [groupedApplications, setGroupedApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const applicationAPI = new ApplicationAPI();

  useEffect(() => {
    loadApplications();
  }, [projectId]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      // 포지션별로 그룹화된 지원자 목록 조회
      const positionData = await applicationAPI.getApplicationsByProjectGroupedByPosition(projectId);
      
      if (positionData && positionData.positions) {
        setGroupedApplications(positionData.positions);
        // 전체 지원자 목록도 유지 (기존 기능 호환성)
        const allApplications = positionData.positions.flatMap(pos => pos.applications || []);
        setApplications(allApplications);
      } else {
        // 포지션별 데이터가 없으면 기존 방식으로 조회
        const data = await applicationAPI.getApplicationsByProject(projectId);
        setApplications(data);
        setGroupedApplications([]);
      }
    } catch (error) {
      console.error('지원자 목록 로드 실패:', error);
      alert('지원자 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await applicationAPI.updateApplicationStatus(applicationId, newStatus);
      alert('지원 상태가 변경되었습니다.');
      loadApplications();
    } catch (error) {
      alert('지원 상태 변경에 실패했습니다.');
    }
  };

  const handleApproveAndAddToTeam = async (applicationId) => {
    try {
      await apiService.applications.approveAndAddToTeam(applicationId);
      alert('지원이 승인되어 팀 멤버로 추가되었습니다.');
      loadApplications();
    } catch (error) {
      alert('승인 및 팀 멤버 추가에 실패했습니다.');
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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 dark:text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400">아직 지원자가 없습니다.</p>
      </div>
    );
  }

  // 포지션별로 그룹화된 데이터가 있으면 포지션별로 표시
  if (groupedApplications.length > 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            지원자 목록 ({applications.length}명)
          </h3>
        </div>

        {groupedApplications.map((positionGroup, index) => (
          <div key={index} className="space-y-3">
            {/* 포지션 헤더 */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                {positionGroup.position || '미지정'}
              </h4>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {positionGroup.current || 0} / {positionGroup.required || 0}명
                </span>
                {positionGroup.isRecruitmentCompleted && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200">
                    모집 완료
                  </span>
                )}
              </div>
            </div>

            {/* 해당 포지션의 지원자 목록 */}
            {positionGroup.applications && positionGroup.applications.length > 0 ? (
              <div className="space-y-3">
                {positionGroup.applications.map((application) => (
                  <div key={application.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {application.applicantUsername}
                          </span>
                          {getStatusBadge(application.status)}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(application.appliedAt)}
                        </p>
                      </div>
                    </div>

                    {application.message && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          {application.message}
                        </p>
                      </div>
                    )}

                    {isOwner && application.status === 'PENDING' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveAndAddToTeam(application.id)}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                        >
                          승인 & 팀 추가
                        </button>
                        <button
                          onClick={() => handleStatusChange(application.id, 'REJECTED')}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                        >
                          거절
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
                이 포지션에 지원자가 없습니다.
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  // 포지션별 데이터가 없으면 기존 방식으로 표시
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          지원자 목록 ({applications.length}명)
        </h3>
      </div>

      {applications.map((application) => (
        <div key={application.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {application.applicantUsername}
                </span>
                {getStatusBadge(application.status)}
                {application.appliedPosition && (
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                    {application.appliedPosition}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(application.appliedAt)}
              </p>
            </div>
          </div>

          {application.message && (
            <div className="mb-3">
              <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                {application.message}
              </p>
            </div>
          )}

          {isOwner && application.status === 'PENDING' && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleApproveAndAddToTeam(application.id)}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
              >
                승인 & 팀 추가
              </button>
              <button
                onClick={() => handleStatusChange(application.id, 'REJECTED')}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
              >
                거절
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ApplicationList;

