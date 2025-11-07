import React from 'react';
import { Link } from 'react-router-dom';

const MyPageDropdownMenu = ({ isOpen, onClose }) => {
  const menuItems = [
    {
      title: '내 지원',
      path: '/my-applications',
      icon: '📝',
      description: '내가 지원한 프로젝트'
    },
    {
      title: '내 팀',
      path: '/my-teams',
      icon: '👥',
      description: '프로젝트 시작 전 팀'
    },
    {
      title: '마이페이지',
      path: '/mypage',
      icon: '⚙️',
      description: '계정 설정'
    }
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="dropdown-menu absolute top-full right-0 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
      style={{ marginTop: '0px' }}
    >
      <div className="py-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            onClick={onClose}
          >
            <span className="text-lg mr-3">{item.icon}</span>
            <div className="flex-1">
              <div className="text-sm font-medium">{item.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyPageDropdownMenu;

