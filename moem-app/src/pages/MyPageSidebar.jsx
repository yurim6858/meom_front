
import React from 'react';

function MyPageSidebar({ items, activeKey, onItemClick }) {
  return (
    <nav>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.key}>
            <button
              onClick={() => onItemClick(item.key)}
              // 현재 활성화된 메뉴에 따라 스타일을 다르게 적용
              className={`
                w-full text-left p-2.5 rounded-lg text-base transition-colors duration-200
                ${activeKey === item.key 
                   ? 'bg-[#A855F7] text-white font-semibold' // 활성화된 메뉴 스타일
                   : 'text-gray-600 hover:text-[#A855F7] hover:bg-blue-50' // 기본 및 호버 스타일
                }
              `}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
export default MyPageSidebar;