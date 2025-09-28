import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { useAuth } from "../../contexts/AuthContext";

const MAX_TITLE = 60;
const MAX_INTRO = 100;
const MAX_DESCRIPTION = 1200;
const ROLE_PRESET = ["Frontend", "Backend", "AI/ML", "Designer", "PM", "Fullstack"];
const WORK_STYLES = ["온라인", "오프라인", "하이브리드"];

export default function ProjectEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [description, setDescription] = useState("");
  const [tagsText, setTagsText] = useState(""); 
  const [deadline, setDeadline] = useState(""); 

  const [workStyle, setWorkStyle] = useState("");
  const [contactType, setContactType] = useState("email");
  const [contactValue, setContactValue] = useState("");
  const [positions, setPositions] = useState([{ role: "", headcount: 1 }]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const tags = Array.from(
    new Set(
      tagsText
        .split(",")
        .map((raw) => raw.trim())
        .filter((raw) => raw.length > 0)
    )
  ).slice(0, 12);

  const todayISO = new Date().toLocaleDateString("sv-SE");

  // 기존 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
        if (!currentUser) {
          navigate('/login');
          return;
        }
        
        const res = await fetch(`http://localhost:8080/api/recruitments/${id}`);
        if (!res.ok) {
          throw new Error("데이터를 불러올 수 없습니다.");
        }
        const data = await res.json();
        
        // 본인의 공고인지 확인
        if (data.username !== currentUser.name) {
          alert('본인의 공고만 수정할 수 있습니다.');
          navigate('/recruitments');
          return;
        }
        
        setTitle(data.title || "");
        setIntro(data.intro || "");
        setDescription(data.description || "");
        setTagsText(data.tags ? data.tags.join(", ") : "");
        setDeadline(data.deadline || "");
        setWorkStyle(data.workStyle || "");
        setContactType(data.contactType || "email");
        setContactValue(data.contactValue || "");
        setPositions(data.positions && data.positions.length > 0 
          ? data.positions.map(p => ({ role: p.role, headcount: p.headcount }))
          : [{ role: "", headcount: 1 }]
        );
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        alert("데이터를 불러오는데 실패했습니다.");
        navigate("/recruitments");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, currentUser, navigate]);

  // 포지션 관리 함수들
  function addPositionRow() {
    setPositions((previousPositions) => [
      ...previousPositions,
      { role: "", headcount: 1 },
    ]);
  }

  function removePositionRow(targetIndex) {
    setPositions((previousPositions) =>
      previousPositions.filter((_, currentIndex) => currentIndex !== targetIndex)
    );
  }

  function changePositionField(targetIndex, fieldKey, nextValue) {
    setPositions((previousPositions) =>
      previousPositions.map((positionItem, currentIndex) => {
        if (currentIndex !== targetIndex) return positionItem;
        return { ...positionItem, [fieldKey]: nextValue };
      })
    );
  }

  // 수정 제출
  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    if (!title.trim()) nextErrors.title = "제목을 입력해 주세요.";
    else if (title.trim().length > MAX_TITLE) nextErrors.title = `제목은 최대 ${MAX_TITLE}자입니다.`;

    if (!intro.trim()) nextErrors.intro = "한줄 소개를 입력해 주세요.";
    else if (intro.trim().length > MAX_INTRO) nextErrors.intro = `한줄 소개는 최대 ${MAX_INTRO}자입니다.`;

    if (!description.trim()) nextErrors.description = "설명을 입력해 주세요.";
    else if (description.trim().length > MAX_DESCRIPTION)
      nextErrors.description = `설명은 최대 ${MAX_DESCRIPTION}자입니다.`;

    if (!deadline) nextErrors.deadline = "마감일을 선택해 주세요.";
    else if (deadline < todayISO) nextErrors.deadline = "마감일은 오늘 이후여야 합니다.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      
      const response = await fetch(`http://localhost:8080/api/recruitments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          intro,
          description,
          tags,
          deadline,
          username: currentUser.name, // 로그인한 사용자 이름 사용
          positions: positions.filter(p => p.role.trim() !== ""),
          workStyle,
          contactType,
          contactValue,
          collaborationPeriod: "1개월 ~ 3개월"
        }),
      });

      if (!response.ok) {
        alert("수정에 실패했어요. 입력값을 확인해 주세요.");
        return;
      }

      alert("수정이 완료되었습니다.");
      navigate(`/recruitments/${id}`);
    } catch (unknownError) {
      console.error(unknownError);
      alert("알 수 없는 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <section className="scroll-mt-[72px]">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="flex justify-center items-center">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-sm text-zinc-600 dark:text-zinc-400">데이터를 불러오는 중...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="scroll-mt-[72px]">
      <div className="container max-w-[1280px] mx-auto px-4 py-8 sm:py-10">
        {/* 상단 */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">프로젝트 공고 수정</h1>
          <button
            type="button"
            onClick={() => navigate(`/recruitments/${id}`)}
            className="rounded-lg border border-black/10 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-zinc-800"
          >
            ← 돌아가기
          </button>
        </div>

        {/* 폼 */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-black/10 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-900/60"
        >
          {/* 제목 */}
          <label className="block text-sm font-medium mb-1">제목 *</label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="예) 사이드프로젝트 프론트엔드 파트너 구합니다"
            maxLength={MAX_TITLE}
            className="w-full rounded-xl border px-3 py-2 text-sm mb-1"
          />
          <div className="flex justify-between text-xs mb-4">
            <span className="text-red-600">{errors.title || "\u00A0"}</span>
            <span className="text-zinc-500">{title.length}/{MAX_TITLE}</span>
          </div>

          {/* 한줄 소개 */}
          <label className="block text-sm font-medium mb-1">한줄 소개 *</label>
          <input
            value={intro}
            onChange={(event) => setIntro(event.target.value)}
            placeholder="예) React와 TypeScript를 활용한 웹 애플리케이션 개발 프로젝트"
            maxLength={MAX_INTRO}
            className="w-full rounded-xl border px-3 py-2 text-sm mb-1"
          />
          <div className="flex justify-between text-xs mb-4">
            <span className="text-red-600">{errors.intro || "\u00A0"}</span>
            <span className="text-zinc-500">{intro.length}/{MAX_INTRO}</span>
          </div>

          {/* 설명 */}
          <label className="block text-sm font-medium mb-1">설명 *</label>
          <textarea
            rows={7}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="프로젝트 개요, 역할, 기술스택, 진행 방식, 기대사항 등 자세히 적어주세요."
            maxLength={MAX_DESCRIPTION}
            className="w-full rounded-xl border px-3 py-2 text-sm mb-1"
          />
          <div className="flex justify-between text-xs mb-4">
            <span className="text-red-600">{errors.description || "\u00A0"}</span>
            <span className="text-zinc-500">{description.length}/{MAX_DESCRIPTION}</span>
          </div>

          {/* 태그 */}
          <label className="block text-sm font-medium mb-1">태그</label>
          <input
            value={tagsText}
            onChange={(event) => setTagsText(event.target.value)}
            placeholder="React, TypeScript, RAG"
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
          <div className="mt-2 flex flex-wrap gap-2 mb-6">
            {tags.length > 0 ? (
              tags.map((tagText, tagIndex) => (
                <span key={`${tagText}-${tagIndex}`} className="rounded bg-zinc-100 px-2.5 py-1 text-xs">
                  {tagText}
                </span>
              ))
            ) : (
              <span className="text-xs text-zinc-500">콤마(,)로 구분해 입력하세요. (최대 12개)</span>
            )}
          </div>

          {/* 모집 포지션/인원 */}
          <label className="block text-sm font-medium mb-2">모집 포지션/인원 (선택)</label>
          <div className="space-y-3 mb-6">
            {positions.map((positionItem, positionIndex) => (
              <div key={positionIndex} className="grid gap-2 sm:grid-cols-12">
                <select
                  value={positionItem.role}
                  onChange={(event) =>
                    changePositionField(positionIndex, "role", event.target.value)
                  }
                  className="sm:col-span-6 rounded-xl border px-3 py-2 text-sm"
                >
                  <option value="">포지션 선택</option>
                  {ROLE_PRESET.map((roleName) => (
                    <option key={roleName} value={roleName}>{roleName}</option>
                  ))}
                </select>

                <input
                  type="number"
                  min={1}
                  value={positionItem.headcount}
                  onChange={(event) =>
                    changePositionField(
                      positionIndex,
                      "headcount",
                      Math.max(1, Number(event.target.value || 1))
                    )
                  }
                  className="sm:col-span-3 rounded-xl border px-3 py-2 text-sm"
                  placeholder="인원"
                />

                <div className="sm:col-span-3 flex gap-2">
                  {positionIndex === positions.length - 1 && (
                    <button
                      type="button"
                      onClick={addPositionRow}
                      className="w-full rounded-xl border px-3 py-2 text-sm"
                    >
                      추가
                    </button>
                  )}
                  {positions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePositionRow(positionIndex)}
                      className="w-full rounded-xl border px-3 py-2 text-sm"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 협업 방식 / 마감일 */}
          <div className="grid gap-4 sm:grid-cols-2 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">협업 방식 (선택)</label>
              <select
                value={workStyle}
                onChange={(event) => setWorkStyle(event.target.value)}
                className="w-full rounded-xl border px-3 py-2 text-sm"
              >
                <option value="">선택하세요</option>
                {WORK_STYLES.map((workStyleName) => (
                  <option key={workStyleName} value={workStyleName}>{workStyleName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">마감일 *</label>
              <input
                type="date"
                value={deadline}
                min={todayISO}
                onChange={(event) => setDeadline(event.target.value)}
                className="w-full rounded-xl border px-3 py-2 text-sm"
              />
              <div className="mt-1 text-xs text-red-600">{errors.deadline}</div>
            </div>
          </div>

          {/* 연락 수단 */}
          <div className="grid gap-4 sm:grid-cols-3 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">연락 수단 (선택)</label>
              <select
                value={contactType}
                onChange={(event) => setContactType(event.target.value)}
                className="w-full rounded-xl border px-3 py-2 text-sm"
              >
                <option value="email">이메일</option>
                <option value="discord">디스코드</option>
                <option value="kakao">카카오톡</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">연락 값</label>
              <input
                value={contactValue}
                onChange={(event) => setContactValue(event.target.value)}
                placeholder="예) example@email.com / username#1234 / 카카오ID"
                className="w-full rounded-xl border px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {isSubmitting ? "수정 중..." : "수정하기"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/recruitments/${id}`)}
              className="rounded-xl border px-4 py-2 text-sm"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
