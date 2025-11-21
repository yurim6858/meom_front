import React from 'react';
import { Link } from 'react-router-dom';

const DropdownMenu = ({ isOpen, onClose }) => {
  const menuItems = [
    {
      title: '프로젝트 탐색',
      path: '/project-posts',
      icon: '🔍'
    },
    {
      title: '공모전 탐색',
      path: '/contests',
      icon: '🏆'
    },
    {
      title: '프로젝트 등록',
      path: '/project-posts/new',
      icon: '➕'
    },
    {
      title: '유저 탐색',
      path: '/users',
      icon: '👥'
    },
    {
      title: '유저 등록',
      path: '/users/register',
      icon: '👤'
    },
    {
      title: '내 공고 관리',
      path: '/my-posts',
      icon: '📋'
    },
    {
      title: 'AI 맞춤 추천',
      path: '/matching/ai-recommend',
      icon: '🤖'
    }
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="dropdown-menu absolute top-full right-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
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
            <span className="text-sm font-medium">{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu;
