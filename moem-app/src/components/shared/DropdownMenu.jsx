import React from 'react';
import { Link } from 'react-router-dom';

const DropdownMenu = ({ isOpen, onClose }) => {
  const menuItems = [
    {
      title: '프로젝트 탐색',
      path: '/recruitments',
      icon: '🔍'
    },
    {
      title: '프로젝트 등록',
      path: '/recruitments/new',
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
    }
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="dropdown-menu absolute top-full right-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
      style={{ marginTop: '0px' }} // 간격 제거
      onMouseEnter={() => {}} // 메뉴 영역에 마우스가 있을 때는 닫히지 않도록
      onMouseLeave={onClose} // 메뉴에서 마우스가 벗어나면 닫기
    >
      <div className="py-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
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
