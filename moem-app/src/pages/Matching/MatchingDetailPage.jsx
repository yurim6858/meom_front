// src/pages/matching/MatchingDetailPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function getDday(dateStr) {
  if (!dateStr) return { label: "-", tone: "text-zinc-500 bg-zinc-100" };
  const today = new Date(); today.setHours(0,0,0,0);
  const due = new Date(dateStr); due.setHours(0,0,0,0);
  const diff = Math.floor((due - today) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: "마감",  tone: "text-red-600 bg-red-50 dark:bg-red-900/20" };
  if (diff === 0) return { label: "D-day", tone: "text-orange-600 bg-orange-50 dark:bg-orange-900/20" };
  return { label: `D-${diff}`, tone: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" };
}

export default function MatchingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [posting, setPosting] = useState(null);
  const [loading, setLoading] = useState(true);

  // 상세 조회
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/recruitments/${id}`);
        if (!res.ok) throw new Error("NOT_FOUND");
        const data = await res.json();
        setPosting(data);
      } catch {
        setPosting(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const dday = useMemo(() => getDday(posting?.deadline), [posting]);

  if (loading) {
    return (
      <section className="scroll-mt-[72px]">
        <div className="container mx-auto px-4 py-16 text-center text-sm text-zinc-500">
          불러오는 중…
        </div>
      </section>
    );
  }

  if (!posting) {
    return (
      <section className="scroll-mt-[72px]">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-xl font-semibold">공고를 찾을 수 없습니다.</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            주소를 확인하거나 목록으로 돌아가세요.
          </p>
          <button
            onClick={() => navigate("/recruitments")}
            className="mt-6 rounded-lg border border-black/10 px-4 py-2 text-sm hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-zinc-800"
          >
            ← 목록으로
          </button>
        </div>
      </section>
    );
  }

  const uniqueTags = Array.from(new Set(posting.tags || []));

  return (
    <section className="scroll-mt-[72px]">
      <div className="container max-w-[1100px] mx-auto px-4 py-10">
        {/* 상단 바 */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/recruitments")}
            className="rounded-lg border border-black/10 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-zinc-800"
          >
            ← 목록으로
          </button>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className={`rounded-md px-2 py-0.5 font-semibold ${dday.tone}`}>{dday.label}</span>
            <span>마감일 <b>{posting.deadline ?? "-"}</b></span>
          </div>
        </div>

        {/* 제목 / 작성자 */}
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{posting.title}</h1>
        <div className="mt-2 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            {posting.username?.[0] ?? "?"}
          </div>
          <span>{posting.username ?? "알 수 없음"}</span>
        </div>

        {/* 본문 카드 */}
        <div className="mt-6 rounded-2xl border border-black/10 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-900/60">
          <h2 className="text-base font-semibold">설명</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-zinc-700 dark:text-zinc-300">
            {posting.description}
          </p>

          <h3 className="mt-6 text-sm font-semibold">태그</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {uniqueTags.length > 0 ? (
              uniqueTags.map((tag, i) => (
                <span
                  key={`${posting.id}-${tag}-${i}`}
                  className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-zinc-500">등록된 태그가 없습니다.</span>
            )}
          </div>

          {/* 액션 (예: 지원/스크랩/삭제 등) */}
          <div className="mt-8 flex gap-3">
            <button
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
              onClick={() => alert("지원 폼은 추후 연결됩니다.")}
            >
              지원하기
            </button>
            <button
              className="rounded-xl border border-black/10 px-4 py-2 text-sm hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-zinc-800"
              onClick={() => alert("스크랩 기능은 추후 연결됩니다.")}
            >
              스크랩
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
