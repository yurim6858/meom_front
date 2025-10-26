import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom'; 
import MyPageSidebar from './MyPageSidebar'; 
import ApplicationPage from './ApplicationPage';
import PortfolioPage from './PortfolioPage';

// 메뉴 데이터 정의
const MENU_ITEMS = [
  { key: 'spec', label: '스펙 정리하기', content: <PortfolioPage/> },
  { key: 'resume', label: '자기소개서 작성', content:<ApplicationPage/> },
  { key: 'comments', label: '내가 쓴 댓글', content: <div></div> },
  { key: 'situation', label: '지원상황', content: <div></div> },
  { key: 'support', label: '고객문의', content: <div></div> },
  { key: 'logout', label: '로그아웃', content: null },
];

function MyPage() {
  const [activeKey, setActiveKey] = useState(MENU_ITEMS[0].key);
  const navigate = useNavigate();

  const activeItem = MENU_ITEMS.find(item => item.key === activeKey);

  // 메뉴 클릭 이벤트 처리 함수
  const handleItemClick = (key) => {
    if (key === 'logout') {
      alert("로그아웃되었습니다."); 
      navigate('//'); 
    } else {
      setActiveKey(key);
    }
  };

  return (
    // Tailwind CSS 클래스를 사용하여 디자인 구현
    <div className="flex min-h-screen bg-gray-100">

      {/* 1. 사이드바 (Sidebar) */}
      <div className="w-56 bg-white p-5 shadow-lg h-screen sticky top-0">
        <h2 className="text-xl font-semibold text-gray-700 mb-8 mt-2">마이페이지</h2>
        <MyPageSidebar
          items={MENU_ITEMS}
          activeKey={activeKey}
          onItemClick={handleItemClick} // 클릭 핸들러 전달
        />
      </div>

      {/* 2. 메인 컨텐츠 (Main Content) */}
      <div className="flex-1 p-10">
        <div className="max-w-4xl mx-auto">
            
          {/* 로그아웃 메뉴가 아닐 때만 제목 표시 */}
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {activeItem && activeItem.key !== 'logout' ? activeItem.label : "환영합니다!"}
          </h1>
          
          <div className="bg-white p-8 rounded-xl shadow-lg min-h-[500px]">
            {/* 로그아웃 메뉴가 아닐 때만 컨텐츠 렌더링 */}
            {activeItem && activeItem.content && activeItem.key !== 'logout' 
              ? activeItem.content 
              : <p>여기에서 나의 시험, 스펙, 자기소개서 등을 관리할 수 있습니다.</p>}
          </div>
          
        </div>
      </div>
    </div>
  );
}
export default MyPage;