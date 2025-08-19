import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const MOCK_POSTS = [
  {
    id: 1,
    title: "프론트엔드 파트너 구함",
    desc: "리액트 + 타입스크립트 사용. 디자인 시스템 경험 우대.",
    tags: ["React", "TypeScript", "Design System"],
    deadline: "2025-09-05", // YYYY-MM-DD
    user: { name: "민지" },
  },
  {
    id: 2,
    title: "백엔드(Express) 협업",
    desc: "API 설계와 인증(토큰) 구현 중심.",
    tags: ["Node", "Express", "JWT"],
    deadline: "2025-08-31",
    user: { name: "현수" },
  },
  {
    id: 3,
    title: "AI 챗봇 PoC",
    desc: "간단한 RAG 데모 완성. 운영 고도화 파트너 찾음.",
    tags: ["LLM", "RAG"],
    deadline: "2025-09-15",
    user: { name: "지윤" },
  },
];

export const getDday = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);

  const diff = Math.floor((due - today) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: "마감", tone: "text-red-600 bg-red-50 dark:bg-red-900/20" };
  if (diff === 0) return { label: "D-day", tone: "text-orange-600 bg-orange-50 dark:bg-orange-900/20" };
  return { label: `D-${diff}`, tone: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" };
};
const InitialBadge = ({ name }) => {
  const initial = name?.[0] ?? "?";
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
      {initial}
    </div>
  );
};
const MatchingPage = () => {
  const [q, setQ] = useState("");
  const [posts] = useState(MOCK_POSTS);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return posts;
    return posts.filter((p) => {
      const inTitle = p.title.toLowerCase().includes(needle);
      const inDesc = p.desc.toLowerCase().includes(needle);
      const inTags = p.tags.some((t) => t.toLowerCase().includes(needle));
      return inTitle || inDesc || inTags;
    });
  }, [q, posts]);

  return (
    <section id="explore" className="scroll-mt-[72px]">
      <div className="container max-w-[1280px] mx-auto px-4 py-8 sm:py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">프로젝트 탐색</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">원하는 프로젝트를 검색하세요. (제목, 설명, 태그)</p>
        </div>
        <div className="mb-6">
          <div className="relative w-full sm:max-w-[1280px] md:max-w-[1280px]">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20 L17 17" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="검색: React, 인증, RAG…"
              aria-label="프로젝트 검색"
              className="w-full rounded-xl border border-black/10 bg-white py-3 pl-11 pr-3 text-base outline-none transition focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:bg-zinc-900"
            />
          </div>
        </div>
        <div className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
          총 <span className="font-medium">{filtered.length}</span>건
        </div>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 p-10 text-center text-sm text-zinc-500 dark:border-white/10">
            조건에 맞는 공고가 없어요.
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filtered.map((p) => {
              const d = getDday(p.deadline);
              return (
                <li
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/matches/${p.id}`)}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/matches/${p.id}`)}
                  className="group cursor-pointer rounded-2xl border border-black/10 bg-white/60 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-900/60"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${d.tone}`}>{d.label}</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      마감일 <span className="font-medium">{p.deadline}</span>
                    </span>
                  </div>
                  <h3 className="text-base font-semibold leading-tight">{p.title}</h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{p.desc}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700 transition group-hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:group-hover:bg-zinc-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <InitialBadge name={p.user?.name} />
                      <span className="text-sm text-zinc-700 dark:text-zinc-200">{p.user?.name ?? "알 수 없음"}</span>
                    </div>
                    <div className="text-xs text-zinc-500 opacity-0 transition group-hover:opacity-100">클릭해서 상세보기 →</div>
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
