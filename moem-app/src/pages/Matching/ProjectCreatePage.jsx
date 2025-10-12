import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { ProjectAPI } from "../../services/api/index";

const MAX_TITLE = 60;
const MAX_INTRO = 100;
const MAX_DESCRIPTION = 1200;
const ROLE_PRESET = ["Frontend", "Backend", "AI/ML", "Designer", "PM", "Fullstack"];
const WORK_STYLES = ["온라인", "오프라인", "하이브리드"];

export default function ProjectCreatePage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const projectAPI = new ProjectAPI();

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
  const [errors, setErrors] = useState({});

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      // 로그인한 사용자 정보로 자동 채우기
      setContactValue(currentUser.email);
    }
  }, [currentUser, navigate]);

  const tags = Array.from(
    new Set(
      tagsText
        .split(",")
        .map((raw) => raw.trim())
        .filter((raw) => raw.length > 0)
    )
  ).slice(0, 12);

  const todayISO = new Date().toLocaleDateString("sv-SE");

  // ---------------------------
  // 조작 함수 1) 행 추가
  // ---------------------------
  function addPositionRow() {
    // previousPositions는 "이전 상태값"을 리액트가 넣어주는 인자 (이름은 임의)
    setPositions((previousPositions) => [
      ...previousPositions,
      { role: "", headcount: 1 },
    ]);
  }

  // ---------------------------
  // 조작 함수 2) 특정 행 삭제
  // ---------------------------
  function removePositionRow(targetIndex) {
    setPositions((previousPositions) =>
      previousPositions.filter((_, currentIndex) => currentIndex !== targetIndex)
    );
  }

  // ---------------------------
  // 조작 함수 3) 특정 행의 특정 필드 변경
  // ---------------------------
  function changePositionField(targetIndex, fieldKey, nextValue) {
    // 핵심: 원본을 직접 바꾸지 말고 map으로 새 배열을 만들어 반환
    setPositions((previousPositions) =>
      previousPositions.map((positionItem, currentIndex) => {
        if (currentIndex !== targetIndex) return positionItem; // 다른 행은 그대로
        // 대상 행만 얕은 복사 후 필드 값 교체 → 새 객체 참조가 되므로 변경 감지 가능
        return { ...positionItem, [fieldKey]: nextValue };
      })
    );
  }

  // 폼 검증
  function validateForm() {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = "제목을 입력해주세요.";
    }
    
    if (!intro.trim()) {
      newErrors.intro = "한줄 소개를 입력해주세요.";
    }
    
    if (!description.trim()) {
      newErrors.description = "설명을 입력해주세요.";
    }
    
    if (!deadline) {
      newErrors.deadline = "마감일을 선택해주세요.";
    }
    
    setErrors({
      ...errors,
      ...newErrors
    });
    
    return Object.keys(newErrors).length === 0;
  }

  // 제출
  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      const projectData = {
        title,
        intro,
        description,
        tags,
        deadline,
        creatorId: currentUser.id, // 백엔드에서 요구하는 creatorId 추가
        username: currentUser.username,
        positions: positions.filter(p => p.role.trim() !== ""),
        workStyle,
        contactType,
        contactValue,
        collaborationPeriod: "1개월 ~ 3개월"
      };

      await projectAPI.createProject(projectData);
      showSuccess("프로젝트가 등록되었습니다!");
      navigate(`/project-posts`);
    } catch (unknownError) {
      console.error(unknownError);
      showError("알 수 없는 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="scroll-mt-[72px]">
      <div className="container max-w-[1280px] mx-auto px-4 py-8 sm:py-10">
        {/* 상단 */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">프로젝트 공고 등록</h1>
          <button
            type="button"
            onClick={() => navigate(-1)}
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

          {/* 모집 포지션/인원 (화면용) */}
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

          {/* 연락 수단 (화면용) */}
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
              {isSubmitting ? "등록 중..." : "등록하기"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
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
