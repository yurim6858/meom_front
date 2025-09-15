import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DdayBadge from "../../components/shared/DdayBadge";
import InitialBadge from "../../components/shared/InitialBadge";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import SearchInput from "../../components/shared/SearchInput";

const MatchingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostings = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("http://localhost:8080/api/recruitments");
        if (!res.ok) throw new Error("네트워크 오류");
        const data = await res.json();
        setPostings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("공고 불러오기 실패:", err);
        setError("공고를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
        setPostings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPostings();
  }, []);

  const filteredPostings = useMemo(() => {
    const searchKeyword = searchQuery.trim().toLowerCase();
    if (!searchKeyword) return postings;

    return postings.filter((posting) => {
      const titleMatch = posting.title?.toLowerCase().includes(searchKeyword);
      const introMatch = posting.intro?.toLowerCase().includes(searchKeyword);
      const descMatch = posting.description?.toLowerCase().includes(searchKeyword);
      const tagsMatch = (posting.tags || []).some((tag) =>
        tag?.toLowerCase().includes(searchKeyword)
      );
      const usernameMatch = posting.username?.toLowerCase().includes(searchKeyword);
      return titleMatch || introMatch || descMatch || tagsMatch || usernameMatch;
    });
  }, [searchQuery, postings]);

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <section id="explore" className="scroll-mt-[72px]">
      <div className="container max-w-[1280px] mx-auto px-4 py-8 sm:py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">프로젝트 탐색</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            원하는 프로젝트를 검색하세요. (제목, 한줄소개, 설명, 태그, 작성자명)
          </p>
        </div>

        <div className="mb-6">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="검색: React, TypeScript, RAG, 작성자명..."
            className="sm:max-w-[1280px] md:max-w-[1280px]"
          />
        </div>

        <div className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
          총 <span className="font-medium">{filteredPostings.length}</span>건
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-sm text-zinc-600 dark:text-zinc-400">공고를 불러오는 중...</span>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              다시 시도
            </button>
          </div>
        ) : filteredPostings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 p-10 text-center text-sm text-zinc-500 dark:border-white/10">
            {searchQuery ? "검색 조건에 맞는 공고가 없어요." : "등록된 공고가 없어요."}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filteredPostings.map((posting) => {
              const uniqueTags = Array.from(new Set(posting.tags || []));

              return (
                <li
                  key={posting.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/recruitments/${posting.id}`)}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/recruitments/${posting.id}`)}
                  className="group cursor-pointer rounded-2xl border border-black/10 bg-white/60 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-900/60"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <DdayBadge dateStr={posting.deadline} />
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      마감일 <span className="font-medium">{posting.deadline ?? "-"}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-semibold leading-tight">{posting.title}</h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2">
                    {posting.intro}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {uniqueTags.map((tag, index) => (
                      <span
                        key={`${posting.id}-${tag}-${index}`}
                        className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700 transition group-hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:group-hover:bg-zinc-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <InitialBadge name={posting.username} />
                      <span className="text-sm text-zinc-700 dark:text-zinc-200">
                        {posting.username ?? "알 수 없음"}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500 opacity-0 transition group-hover:opacity-100">
                      클릭해서 상세보기 →
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
};

export default MatchingPage;
