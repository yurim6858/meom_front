import React, { useEffect, useState } from "react";
import { getDday } from "./MatchingPage";
import { useNavigate, useParams } from "react-router-dom";

const RecruitmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/recruitments/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("서버 오류");
        return res.json();
      })
      .then((data) => setPost(data))
      .catch(() => setPost(undefined));
  }, [id]);

  if (post === undefined) {
    return (
      <section className="scroll-mt-[72px]">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-xl font-semibold">공고를 찾을 수 없습니다.</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            주소를 확인하거나 목록으로 돌아가세요.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 rounded-lg border border-black/10 px-4 py-2 text-sm hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-zinc-800"
          >
            ← 이전 페이지
          </button>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-zinc-500">불러오는 중...</p>
      </div>
    );
  }

  const d = getDday(post.deadline);

  return (
    <section className="scroll-mt-[72px]">
      <div className="container max-w-[1280px] mx-auto px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg border border-black/10 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-zinc-800"
          >
            ← 목록으로
          </button>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className={`rounded-md px-2 py-0.5 font-semibold ${d.tone}`}>
              {d.label}
            </span>
            <span>
              마감일 <b>{post.deadline || "-"}</b>
            </span>
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {post.title}
        </h1>

        <div className="mt-2 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            {post.username?.[0] ?? "?"}
          </div>
          <span>{post.username ?? "알 수 없음"}</span>
        </div>

        <div className="mt-6 rounded-2xl border border-black/10 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-900/60">
          <h2 className="text-base font-semibold">설명</h2>
          <p className="mt-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
            {post.description}
          </p>

          <h3 className="mt-6 text-sm font-semibold">태그</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {post.tags?.map((t) => (
              <span
                key={t}
                className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              >
                {t}
              </span>
            ))}
          </div>

          {/* 확장 영역 예시 */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
              <div className="text-xs text-zinc-500">협업 형태</div>
              <div className="mt-1 text-sm">파트너십 / 사이드 프로젝트</div>
            </div>
            <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
              <div className="text-xs text-zinc-500">연락 방법</div>
              <div className="mt-1 text-sm">추후 상세에 추가 예정</div>
            </div>
          </div>

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
};

export default RecruitmentDetailPage;

