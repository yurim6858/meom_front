import React from 'react';
import { Link } from 'react-router-dom';

const TeamProjectDropdownMenu = ({ isOpen, onClose }) => {
  const menuItems = [
    {
      title: '내 프로젝트',
      path: '/my-projects',
      icon: '🚀',
      description: '진행 중인 프로젝트'
    }
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="dropdown-menu absolute top-full left-0 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
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

export default TeamProjectDropdownMenu;

