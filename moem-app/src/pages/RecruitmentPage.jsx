// src/pages/project/ProjectCreatePage.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const MAX_TITLE = 60;
const MAX_DESC = 1000;

export default function ProjectCreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tagsInput, setTagsInput] = useState(""); 
  const [deadline, setDeadline] = useState("");
  const [username, setUsername] = useState(""); 
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const tags = useMemo(
    () =>
      tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
        .slice(0, 12),
    [tagsInput]
  );

  const todayISO = useMemo(() => {
    const d = new Date(); d.setHours(0,0,0,0);
    return d.toISOString().slice(0, 10);
  }, []);

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "제목을 입력해 주세요.";
    if (title.trim().length > MAX_TITLE) e.title = `제목은 최대 ${MAX_TITLE}자입니다.`;
    if (!desc.trim()) e.desc = "설명을 입력해 주세요.";
    if (desc.trim().length > MAX_DESC) e.desc = `설명은 최대 ${MAX_DESC}자입니다.`;
    if (!deadline) e.deadline = "마감일을 선택해 주세요.";
    if (deadline && deadline < todayISO) e.deadline = "마감일은 오늘 이후여야 합니다.";
    if (!username.trim()) e.username = "작성자 이름을 입력해 주세요.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
  
      const response = await fetch("http://localhost:8080/api/recruitments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, desc, tags, deadline, username }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error(err);
        alert("등록 실패");
        return;
      }
      const saved = await response.json(); // { id, title, desc, ... }
      navigate(`/recruitments/${saved.id}`);  // ✅ 등록된 공고 상세로 이동
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <section className="scroll-mt-[72px]">
      <div className="container max-w-[1280px] mx-auto px-4 py-8 sm:py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">프로젝트 등록</h1>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border border-black/10 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-zinc-800"
          >
            ← 돌아가기
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-black/10 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-900/60"
          noValidate
        >
          {/* 제목 */}
          <div className="mb-5">
            <label className="mb-1 block text-sm font-medium">제목</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예) 프론트엔드 파트너 구합니다"
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:bg-zinc-900"
            />
            <div className="mt-1 flex justify-between text-xs text-zinc-500">
              <span>{errors.title || "\u00A0"}</span>
              <span>{title.length}/{MAX_TITLE}</span>
            </div>
          </div>

          {/* 설명 */}
          <div className="mb-5">
            <label className="mb-1 block text-sm font-medium">설명</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={6}
              placeholder="역할, 기술스택, 협업 방식, 기대사항 등을 적어주세요."
              className="w-full resize-y rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:bg-zinc-900"
            />
            <div className="mt-1 flex justify-between text-xs text-zinc-500">
              <span>{errors.desc || "\u00A0"}</span>
              <span>{desc.length}/{MAX_DESC}</span>
            </div>
          </div>

          {/* 태그 */}
          <div className="mb-5">
            <label className="mb-1 block text-sm font-medium">태그</label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="React, TypeScript, RAG"
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:bg-zinc-900"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  {tag}
                </span>
              ))}
              {tags.length === 0 && (
                <span className="text-xs text-zinc-500">콤마(,)로 구분해 입력하세요.</span>
              )}
            </div>
          </div>

          {/* 마감일 / 작성자 */}
          <div className="mb-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">마감일</label>
              <input
                type="date"
                value={deadline}
                min={todayISO}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:bg-zinc-900"
              />
              <div className="mt-1 text-xs text-red-600">{errors.deadline}</div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">작성자</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="예) 민지"
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:bg-zinc-900"
              />
              <div className="mt-1 text-xs text-red-600">{errors.username}</div>
            </div>
          </div>

          {/* 액션 */}
          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              {submitting ? "등록 중..." : "등록하기"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-black/10 px-4 py-2 text-sm hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-zinc-800"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
