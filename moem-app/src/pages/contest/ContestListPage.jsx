import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../../components/shared/LoadingSpinner"; 
import SearchInput from "../../components/shared/SearchInput";

const ContestListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Spring Boot API 호출 (포트 8080)
        const response = await axios.get('http://localhost:8080/api/contests');
        setContests(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("공모전 불러오기 실패:", err);
        setError("공모전 정보를 불러오는데 실패했습니다.");
        setContests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  // 검색 필터링 (제목, 주최자, 카테고리)
  const filteredContests = useMemo(() => {
    const searchKeyword = searchQuery.trim().toLowerCase();
    if (!searchKeyword) return contests;

    return contests.filter((contest) => {
      const titleMatch = contest.title?.toLowerCase().includes(searchKeyword);
      const hostMatch = contest.host?.toLowerCase().includes(searchKeyword);
      const categoryMatch = contest.category?.toLowerCase().includes(searchKeyword);
      return titleMatch || hostMatch || categoryMatch;
    });
  }, [contests, searchQuery]);

  // 카드 클릭 시 외부 링크(위비티 등)로 이동
  const handleCardClick = (url) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  // D-Day 배지 스타일 계산 헬퍼
  const getDdayStyle = (dday) => {
    if (dday <= 3) return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200";
    if (dday <= 7) return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200";
    return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200";
  };

  if (loading) {
    return (
      <section className="scroll-mt-[72px]">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="flex justify-center items-center">
            {/* 기존 컴포넌트 사용 (없으면 <div>Loading...</div> 대체 가능) */}
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-sm text-zinc-600 dark:text-zinc-400">최신 공모전 정보를 긁어오는 중...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="scroll-mt-[72px]">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="scroll-mt-[72px]">
      <div className="container max-w-[1280px] mx-auto px-4 py-8">
        
        {/* 헤더 섹션 */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">공모전 탐색</h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              AI가 수집한 최신 공모전 정보를 확인하세요. (제목, 분야, 주최사)
            </p>
          </div>
          {/* 우측 버튼 (필요시 사용, 현재는 장식용) */}
          <div className="hidden sm:block">
             <span className="text-xs text-zinc-500">Data source: Wevity</span>
          </div>
        </div>

        {/* 검색 섹션 */}
        <div className="mb-6">
          <SearchInput
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="공모전 제목, 분야(IT, 마케팅), 주최사로 검색..."
          />
        </div>

        {/* 결과 카운트 */}
        <div className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
          총 <span className="font-medium">{filteredContests.length}</span>개의 공모전이 진행 중입니다.
        </div>

        {/* 공모전 목록 그리드 */}
        {filteredContests.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <div className="text-gray-400 text-lg">
              {searchQuery ? "검색 결과가 없습니다." : "현재 진행 중인 공모전이 없습니다."}
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {filteredContests.map((contest) => (
              <div
                key={contest.id}
                onClick={() => handleCardClick(contest.sourceUrl)}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer relative"
              >
                <div className="p-6">
                  
                  {/* 상단: 주최사 & D-Day */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        {/* 주최사 아이콘 (InitialBadge 대신 간단한 아이콘 사용) */}
                        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300 text-xs font-bold">
                            {contest.host ? contest.host.charAt(0) : "C"}
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {contest.host}
                        </span>
                    </div>
                    
                    {/* D-Day 배지 (커스텀 스타일 적용) */}
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getDdayStyle(contest.dday)}`}>
                        D-{contest.dday}
                    </span>
                  </div>

                  {/* 제목 */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {contest.title}
                  </h3>

                  {/* 카테고리 태그 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {contest.category.split(',').map((tag, idx) => (
                        <span 
                            key={idx} 
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md text-xs"
                        >
                            {tag.trim()}
                        </span>
                    ))}
                  </div>

                  {/* 하단 정보: 마감일 & 바로가기 */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>~ {contest.deadline} 마감</span>
                    </div>
                    
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        상세보기 
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ContestListPage;