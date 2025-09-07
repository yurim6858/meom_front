import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const MAX_TITLE = 60;
const MAX_DESC = 1200;

const ROLE_PRESET = ["Frontend", "Backend", "AI/ML", "Designer", "PM", "Fullstack"];
const WORK_STYLES = ["온라인", "오프라인", "하이브리드"];

export default function RecruitmentPage() {
  const navigate = useNavigate();

  // 필수(백엔드와 호환)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [deadline, setDeadline] = useState("");
  const [username, setUsername] = useState("");

  // 선택(화면용, 추후 백엔드 확장 시 전송)
  const [workStyle, setWorkStyle] = useState("");
  const [contactType, setContactType] = useState("email");
  const [contactValue, setContactValue] = useState("");
  const [positions, setPositions] = useState([{ role: "", headcount: 1 }]);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // 태그 파싱 (중복제거 + 최대 12개)
  const tags = useMemo(() => {
    const base = tagsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return Array.from(new Set(base)).slice(0, 12);
  }, [tagsInput]);

  // 오늘(마감일 최소값)
  const todayISO = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  }, []);

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "제목을 입력해 주세요.";
    else if (title.trim().length > MAX_TITLE) e.title = `제목은 최대 ${MAX_TITLE}자입니다.`;

    if (!description.trim()) e.description = "설명을 입력해 주세요.";
    else if (description.trim().length > MAX_DESC) e.description = `설명은 최대 ${MAX_DESC}자입니다.`;

    if (!deadline) e.deadline = "마감일을 선택해 주세요.";
    else if (deadline < todayISO) e.deadline = "마감일은 오늘 이후여야 합니다.";

    if (!username.trim()) e.username = "작성자 이름을 입력해 주세요.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addPosition = () => setPositions((prev) => [...prev, { role: "", headcount: 1 }]);
  const removePosition = (idx) =>
    setPositions((prev) => prev.filter((_, i) => i !== idx));
  const changePosition = (idx, key, value) =>
    setPositions((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [key]: value } : p))
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);

      // ✅ 현재 백엔드가 받는 필드만 전송 (title/description/tags/deadline/username)
      //    나머지(workStyle, contact*, positions)는 추후 스키마 추가 후 함께 전송하면 됨.
      const res = await fetch("http://localhost:8080/api/recruitments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          tags,
          deadline,
          username,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("등록 실패:", err);
        alert("등록에 실패했어요. 입력값을 확인해 주세요.");
        return;
      }

      const saved = await res.json();
      navigate(`/recruitments/${saved.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="scroll-mt-[72px]">
      <div className="container max-w-[1100px] mx-auto px-4 py-8 sm:py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">매칭 공고 등록</h1>
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
          noValidate
          className="rounded-2xl border border-black/10 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-900/60"
        >
          {/* 제목 */}
          <Field
            label="제목 *"
            value={title}
            onChange={setTitle}
            placeholder="예) 사이드프로젝트 프론트엔드 파트너 구합니다"
            error={errors.title}
            counter={`${title.length}/${MAX_TITLE}`}
          />

          {/* 설명 */}
          <Field
            label="설명 *"
            textarea
            rows={7}
            value={description}
            onChange={setDescription}
            placeholder="프로젝트 개요, 역할, 기술스택, 진행 방식, 기대사항 등 자세히 적어주세요."
            error={errors.description}
            counter={`${description.length}/${MAX_DESC}`}
          />

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
              {tags.map((tag, i) => (
                <span
                  key={`${tag}-${i}`}
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

          {/* 모집 포지션/인원 (화면용) */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium">모집 포지션/인원 (선택)</label>
            <div className="space-y-3">
              {positions.map((pos, idx) => (
                <div key={idx} className="grid gap-2 sm:grid-cols-12">
                  <select
                    value={pos.role}
                    onChange={(e) => changePosition(idx, "role", e.target.value)}
                    className="sm:col-span-6 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none dark:border-white/10 dark:bg-zinc-900"
                  >
                    <option value="">포지션 선택</option>
                    {ROLE_PRESET.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    value={pos.headcount}
                    onChange={(e) =>
                      changePosition(idx, "headcount", Math.max(1, Number(e.target.value || 1)))
                    }
                    className="sm:col-span-3 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none dark:border-white/10 dark:bg-zinc-900"
                    placeholder="인원"
                  />
                  <div className="sm:col-span-3 flex gap-2">
                    {idx === positions.length - 1 && (
                      <button
                        type="button"
                        onClick={addPosition}
                        className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-zinc-800"
                      >
                        추가
                      </button>
                    )}
                    {positions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePosition(idx)}
                        className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-zinc-800"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              ※ 현재는 화면 표시용입니다. 백엔드 스키마 확장 시 함께 저장하도록 전송 필드에 포함하세요.
            </p>
          </div>

          {/* 협업 방식 / 마감일 / 작성자 */}
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">협업 방식 (선택)</label>
              <select
                value={workStyle}
                onChange={(e) => setWorkStyle(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none dark:border-white/10 dark:bg-zinc-900"
              >
                <option value="">선택하세요</option>
                {WORK_STYLES.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">마감일 *</label>
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
              <label className="mb-1 block text-sm font-medium">작성자 *</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="예) 민지"
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none dark:border-white/10 dark:bg-zinc-900"
              />
              <div className="mt-1 text-xs text-red-600">{errors.username}</div>
            </div>
          </div>

          {/* 연락 수단 (화면용) */}
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">연락 수단 (선택)</label>
              <select
                value={contactType}
                onChange={(e) => setContactType(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none dark:border-white/10 dark:bg-zinc-900"
              >
                <option value="email">이메일</option>
                <option value="discord">디스코드</option>
                <option value="kakao">카카오톡</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">연락 값</label>
              <input
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                placeholder="예) example@email.com / username#1234 / 카카오ID"
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none dark:border-white/10 dark:bg-zinc-900"
              />
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

/** 공통 필드 컴포넌트 */
function Field({ label, value, onChange, placeholder, error, counter, textarea, rows, ...rest }) {
  const Comp = textarea ? "textarea" : "input";
  return (
    <div className="mb-5">
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <Comp
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={textarea ? rows || 6 : undefined}
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:bg-zinc-900"
        {...rest}
      />
      <div className="mt-1 flex justify-between text-xs">
        <span className="text-red-600">{error || "\u00A0"}</span>
        {counter && <span className="text-zinc-500">{counter}</span>}
      </div>
    </div>
  );
}
