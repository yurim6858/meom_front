import React, { useEffect, useState } from "react";
import FilterBar from "../../components/matching/FilterBar";
import ProfileCard from "../../components/matching/ProfileCard";
import { getAiRecommendations } from "../../lib/api";
import useDebounce from "../../utils/useDebounce";

export default function AiRecommendPage() {
    const [tab, setTab] = useState("ai");
    const [query, setQuery] = useState("");
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [savedIds, setSavedIds] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const debounceQuery = useDebounce(query, 400);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const { data } = await getAiRecommendations({
                baseId: 1,
                limit: 20,
                skills: selectedSkills,
                query: debounceQuery,
                tab,
            });
            setProfiles(data);
        } catch (error) {
            console.error("프로필 에러 : ", error);
            setProfiles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, [debounceQuery, selectedSkills.join("|"), tab]);

    const onToggleSave = (id) => {
        setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };
    const onInvite = (id) => {
        alert(`영입제안이 전송되었습니다 : #${id}`);
    };
    
    const emptyState = (
        <div className = "text-center py-16 text-slate-500">
            <div className = "mx-auto w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6" viewBox="0 0 24 24"><path d="M12 3l2.4 4.8L20 9l-4 3.9L17 19l-5-2.6L7 19l1-6.1L4 9l5.6-1.2L12 3z" fill="currentColor"/>
                </svg>
            </div>
            <div className = "font-medium text-slate-700">조건에 맞는 추천 결과가 없어요</div>
            <div className = "text-sm">검색어나 조건을 변경해보세요</div>
        </div>
    );

    return (
    <div className="min-h-[100dvh] bg-slate-50/60">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight">프로젝트 탐색</h1>
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-teal-600 text-white">AI 추천</span>
          </div>
          <nav className="hidden md:flex items-center gap-4 text-sm text-slate-600">
            <a className="hover:text-slate-900">개인프로젝트</a>
            <a className="hover:text-slate-900">팀프로젝트</a>
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
              placeholder="이름, 역할, 학교, 지역 등으로 검색"
              className="w-full pl-10 h-12 rounded-xl shadow-sm border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" viewBox="0 0 24 24">
              <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 21.49 21.49 20 15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>

          <div className="flex items-center justify-between">
            <div className="inline-flex rounded-full border border-slate-200 overflow-hidden">
              {["all", "ai"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 text-sm ${tab === t ? "bg-teal-600 text-white" : "bg-white text-slate-700"}`}
                >
                  {t === "all" ? "전체" : "AI 추천"}
                </button>
              ))}
            </div>
            <FilterBar
              selected={selectedSkills}
              onToggle={(sid) =>
                setSelectedSkills((prev) => (prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid]))
              }
              onOpenAdvanced={() => alert("고급 필터 (역할/지역/가용성 등)")}
            />
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={`skel-${i}`} className="rounded-2xl border border-slate-200 overflow-hidden">
                <div className="animate-pulse p-5">
                  <div className="h-5 w-40 bg-slate-200 rounded" />
                  <div className="h-4 w-24 bg-slate-200 rounded mt-2" />
                  <div className="h-7 w-full bg-slate-200 rounded mt-4" />
                  <div className="h-2 w-40 bg-slate-200 rounded mt-6" />
                </div>
              </div>
            ))}

          {!loading && profiles.length === 0 && emptyState}

          {!loading &&
            profiles.map((p) => (
              <ProfileCard
                key={p.id}
                profile={p}
                saved={savedIds.includes(p.id)}
                onToggleSave={onToggleSave}
                onInvite={onInvite}
              />
            ))}
        </section>
        <div className="flex justify-center mt-8">
          <button className="rounded-full px-6 py-2 border border-slate-300 hover:bg-slate-50" onClick={fetchProfiles}>
            더 보기
          </button>
        </div>
      </main>
    </div>
  );
}