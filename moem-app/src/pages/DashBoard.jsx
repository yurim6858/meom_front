import React from "react";

export default function MyPage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-3 gap-6">
        {/* 팀진행도 */}
        <div className="col-span-2 bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-4">팀진행도</h2>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>팀명/진행중/진행도%</span>
              <a href="#" className="text-purple-500">
                작업하러 가기 &gt;
              </a>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-purple-400 h-3 rounded-full w-1/2"></div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>이름 / 진행중 / 75%</span>
              <a href="#" className="text-purple-500">
                작업하러 가기 &gt;
              </a>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-purple-400 h-3 rounded-full w-3/4"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>메타소융 / 완료 / 100%</span>
              <a href="#" className="text-purple-500">
                프로젝트 보기 &gt;
              </a>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-purple-400 h-3 rounded-full w-full"></div>
            </div>
          </div>
        </div>

        {/* 지원 상황 */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-4">지원 상황</h2>
          <ul className="text-sm space-y-2">
            <li className="flex justify-between">
              <span>웹반</span> <span>선발중</span>
            </li>
            <li className="flex justify-between">
              <span>메타버스반</span> <span>선발중</span>
            </li>
            <li className="flex justify-between">
              <span>팀세종</span> <span>선발완료(합격)</span>
            </li>
            <li className="flex justify-between">
              <span>소융</span> <span>선발완료(불합격)</span>
            </li>
          </ul>
        </div>

        {/* 해야 할 일 목록 */}
        <div className="col-span-2 bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-4">해야 할 일 목록</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            {/* 해야할 일 */}
            <div>
              <h3 className="font-semibold mb-2 text-gray-600">• 해야할 일</h3>
              <div className="space-y-2">
                <div className="p-3 bg-gray-100 rounded">리허설 발표</div>
                <div className="p-3 bg-gray-100 rounded">논문 찾아보기</div>
                <div className="p-3 bg-gray-100 rounded">SQLD 자격증 준비</div>
              </div>
            </div>

            {/* 진행중 */}
            <div>
              <h3 className="font-semibold mb-2 text-orange-500">• 진행중</h3>
              <div className="space-y-2">
                <div className="p-3 bg-orange-100 rounded">발표 자료 고치기</div>
              </div>
            </div>

            {/* 완료 */}
            <div>
              <h3 className="font-semibold mb-2 text-green-500">• 완료</h3>
              <div className="space-y-2">
                <div className="p-3 bg-green-100 rounded">
                  프로토타입 피드백 받기
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 메시지 */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">메시지</h2>
            <div className="w-10 h-5 flex items-center bg-green-400 rounded-full p-1 cursor-pointer">
              <div className="bg-white w-4 h-4 rounded-full shadow"></div>
            </div>
          </div>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              <div>
                <p className="font-semibold">이름</p>
                <p className="text-gray-500">Hahahaha!</p>
              </div>
              <span className="ml-auto text-xs text-gray-400">Today, 9:52pm</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              <div>
                <p className="font-semibold">모꼬지</p>
                <p className="text-gray-500">저희 팀에 오실래요?</p>
              </div>
              <span className="ml-auto text-xs text-gray-400">
                Yesterday, 12:31pm
              </span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              <div>
                <p className="font-semibold">F2</p>
                <p className="text-gray-500">포트폴 할 수 있으신가요?</p>
              </div>
              <span className="ml-auto text-xs text-gray-400">
                Wednesday, 9:12am
              </span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              <div>
                <p className="font-semibold">웹반</p>
                <p className="text-gray-500">00대회 같이 나가실래요?</p>
              </div>
              <span className="ml-auto text-xs text-gray-400">
                Wednesday, 9:12am
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
