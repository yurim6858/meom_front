import React, { useEffect, useState } from "react";
import ProfileCard from "@/components/matching/ProfileCard";
import ProfileDetailModal from "../../components/matching/ProfileDetailModal";

export default function AiRecommendPage() {
  const [query, setQuery] = useState("");
  const [savedIds, setSavedIds] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/match/users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProfiles(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleNaturalSearch = async () => {
    if (!query.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/match/recommend/natural', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query }),
      });
      if (!response.ok) {
        throw new Error('Natural search failed');
      }
      const data = await response.json();
      setProfiles(data.recommendations); 
    } catch (error) {
      console.error("Failed to perform natural search:", error);
      alert("AI 검색에 실패했습니다. 서버 상태를 확인해주세요.");
      setProfiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onToggleSave = (id) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const onInvite = (id) => {
    alert(`영입제안이 전송되었습니다 : #${id}`);
  };

  const handleViewDetails = (profile) => {
    setSelectedProfile(profile);
  };

  const handleCloseModal = () => {
    setSelectedProfile(null);
  };

  const emptyState = (
    <div className="text-center py-16 text-slate-500">
      <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path d="M12 3l2.4 4.8L20 9l-4 3.9L17 19l-5-2.6L7 19l1-6.1L4 9l5.6-1.2L12 3z" fill="currentColor"/>
        </svg>
      </div>
      <div className="font-medium text-slate-700">조건에 맞는 추천 결과가 없어요</div>
      <div className="text-sm">검색어나 조건을 변경해보세요</div>
    </div>
  );

  const loadingState = (
    <div className="text-center py-16 text-slate-500">
      <p>AI가 검색 결과를 분석 중입니다...</p>
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-slate-50/60">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight">팀원 찾기</h1>
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-teal-600 text-white">AI 추천</span>
          </div>
          <nav className="hidden md:flex items-center gap-4 text-sm text-slate-600">
            <a className="font-semibold text-slate-900">매칭</a>
            <a className="hover:text-slate-900">프로필</a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">
        <section className="flex flex-col gap-4">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNaturalSearch();
              }}
              placeholder="예: 스프링 잘하는 백엔드 개발자"
              className="w-full pl-10 h-12 rounded-xl shadow-sm border border-slate-200 bg-white focus-outline-none focus-ring-2 focus:ring-teal-500"
            />
            <svg
              onClick={handleNaturalSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 cursor-pointer"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 21.49 21.49 20 15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
        </section>
        
        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {isLoading ? (
            loadingState
          ) : profiles.length === 0 ? (
            emptyState
          ) : (
            profiles.map((p) => (
              <ProfileCard
                key={p.id}
                profile={p}
                saved={savedIds.includes(p.id)}
                onToggleSave={onToggleSave}
                onInvite={onInvite}
                onViewDetails={handleViewDetails}
              />
            ))
          )}
        </section>
      </main>
      
      <ProfileDetailModal profile={selectedProfile} onClose={handleCloseModal} />
    </div>
  );
}