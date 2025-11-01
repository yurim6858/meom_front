import React, { useEffect, useState } from "react";
import ProfileCard from "@/components/matching/ProfileCard";
import ProfileDetailModal from "../../components/matching/ProfileDetailModal";
const ALL_TAGS = [
  "Java", "Spring", "MySQL", "Python", "Django", "React", "TypeScript", "CSS", "Kafka", "Pandas", "ML"
];

export default function AiRecommendPage() {
  const [savedIds, setSavedIds] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedTags, setSelectedTags] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let response;
        if (selectedTags.length === 0) {
          response = await fetch('/api/match/users');
        } else {
          response = await fetch('/api/match/tags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(selectedTags),
          });
        }
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        setProfiles(data);

      } catch (error) {
        console.error("Failed to fetch data:", error);
        setProfiles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedTags]); 

  const handleTagClick = (tag) => {
    setSelectedTags((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t) => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
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
      <p>데이터를 불러오는 중입니다...</p>
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-slate-50/60">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">
        <section className="flex flex-col gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60">
            <h3 className="text-sm font-semibold mb-3 text-slate-800">기술 스택으로 필터링</h3>
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      isSelected 
                        ? 'bg-teal-600 text-white shadow-md' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
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