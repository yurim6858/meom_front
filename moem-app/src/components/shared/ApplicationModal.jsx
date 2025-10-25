import React, { useState } from 'react';
import { ApplicationAPI } from '../../services/api/index';

const ApplicationModal = ({ isOpen, onClose, projectId, projectTitle, projectPositions = [] }) => {
  const [message, setMessage] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // localStorage에서 사용자 정보 가져오기
  const getCurrentUser = () => {
    const username = localStorage.getItem('username');
    return username ? { username } : null;
  };
  const currentUser = getCurrentUser();
  const applicationAPI = new ApplicationAPI();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert('지원 메시지를 입력해주세요.');
      return;
    }

    if (!selectedPosition) {
      alert('지원할 포지션을 선택해주세요.');
      return;
    }

    if (!currentUser?.username) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('지원 요청 데이터:', {
        projectId: projectId,
        message: message.trim(),
        appliedPosition: selectedPosition,
        username: currentUser?.username
      });
      
      await applicationAPI.createApplication({
        projectId: projectId,
        message: message.trim(),
        appliedPosition: selectedPosition
      }, currentUser?.username);
      
      alert('지원이 완료되었습니다!');
      onClose();
      setMessage('');
      setSelectedPosition('');
    } catch (error) {
      console.error('지원 생성 오류:', error);
      console.error('오류 상세:', error.response?.data);
      console.error('오류 상태:', error.response?.status);
      alert(`지원 실패: ${error.message || '네트워크 오류가 발생했습니다.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            프로젝트 지원
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            프로젝트: <span className="font-medium">{projectTitle}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              지원 포지션
            </label>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">포지션을 선택해주세요</option>
              {projectPositions.map((position, index) => (
                <option key={index} value={position.role}>
                  {position.role} ({position.headcount}명)
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              지원 메시지
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="프로젝트에 지원하는 이유와 자신의 경험을 간단히 작성해주세요."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              rows={4}
              maxLength={500}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {message.length}/500
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !message.trim() || !selectedPosition}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
            >
              {isSubmitting ? '지원 중...' : '지원하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;

