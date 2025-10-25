import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAPI } from "../../services/api/index";

const MAX_USERNAME = 20;
const MAX_INTRO = 100;

export default function UserCreatePage() {
  const navigate = useNavigate();
  const userAPI = new UserAPI();
  
  // localStorage에서 사용자 정보 가져오기
  const getCurrentUser = () => {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('accessToken');
    return username && token ? { username, email, token } : null;
  };

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [intro, setIntro] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [workStyle, setWorkStyle] = useState("");
  const [collaborationPeriod, setCollaborationPeriod] = useState("");
  const [contactType, setContactType] = useState("email");
  const [contactValue, setContactValue] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    const checkExistingProfile = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      try {
        // 이미 등록된 프로필이 있는지 확인
        const savedUsers = await userAPI.getUsers();
        const existingProfile = savedUsers.find(user => user.username === currentUser.username);
        
        if (existingProfile) {
          alert('이미 등록된 프로필이 있습니다. 수정하려면 프로필 상세 페이지에서 수정 버튼을 클릭하세요.');
          navigate('/users');
          return;
        }
        
        // 로그인한 사용자 정보로 자동 채우기
        if (currentUser) {
          setEmail(currentUser.email || '');
          setUsername(currentUser.username || '');
          setContactValue(currentUser.email || '');
        }
      } catch (error) {
        console.log('기존 프로필 확인 중 오류:', error);
        // 로그인한 사용자 정보로 자동 채우기
        if (currentUser) {
          setEmail(currentUser.email || '');
          setUsername(currentUser.username || '');
          setContactValue(currentUser.email || '');
        }
      }
    };

    checkExistingProfile();
  }, [navigate]);

  const skills = Array.from(
    new Set(
      skillsText
        .split(",")
        .map((raw) => raw.trim())
        .filter((raw) => raw.length > 0)
    )
  ).slice(0, 15);

  const WORK_STYLE_OPTIONS = ["원격", "오프라인", "하이브리드"];
  const COLLABORATION_PERIOD_OPTIONS = ["1개월", "2-3개월", "4-6개월", "6개월 이상", "협의"];

  // 등록 제출
  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    if (!email.trim()) nextErrors.email = "이메일을 입력해 주세요.";
    if (!username.trim()) nextErrors.username = "사용자명을 입력해 주세요.";
    else if (username.trim().length > MAX_USERNAME) nextErrors.username = `사용자명은 최대 ${MAX_USERNAME}자입니다.`;

    if (!intro.trim()) nextErrors.intro = "한줄 소개를 입력해 주세요.";
    else if (intro.trim().length > MAX_INTRO) nextErrors.intro = `한줄 소개는 최대 ${MAX_INTRO}자입니다.`;

    if (!workStyle) nextErrors.workStyle = "작업 방식을 선택해 주세요.";
    if (!collaborationPeriod) nextErrors.collaborationPeriod = "협업 기간을 선택해 주세요.";
    if (!contactValue.trim()) nextErrors.contactValue = "연락처를 입력해 주세요.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      
      // 백엔드 API에 맞는 데이터 구조
      const skills = skillsText.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
      
      const userData = {
        email,
        username,
        intro,
        skills,
        workStyle,
        collaborationPeriod,
        contactType,
        contactValue
      };

      // API 서비스를 통해 사용자 데이터 생성
      await userAPI.createUser(userData);

      alert("프로필 등록이 완료되었습니다!");
      navigate("/users");
    } catch (unknownError) {
      console.error(unknownError);
      alert("알 수 없는 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="scroll-mt-[72px]">
      <div className="container max-w-[1280px] mx-auto px-4 py-8 sm:py-10">
        {/* 상단 */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">프로필 등록</h1>
          <button
            type="button"
            onClick={() => navigate("/users")}
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
          {/* 이메일 */}
          <label className="block text-sm font-medium mb-1">이메일 *</label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border px-3 py-2 text-sm mb-1 bg-gray-50"
            disabled
          />
          <div className="flex justify-between text-xs mb-4">
            <span className="text-blue-600">로그인한 사용자의 이메일이 자동으로 입력됩니다</span>
            <span className="text-zinc-500">{email?.length || 0}/120</span>
          </div>

          {/* 사용자명 */}
          <label className="block text-sm font-medium mb-1">사용자명 *</label>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full rounded-xl border px-3 py-2 text-sm mb-1"
            placeholder="예) 개발자김철수"
          />
          <div className="flex justify-between text-xs mb-4">
            <span className="text-red-600">{errors.username || "\u00A0"}</span>
            <span className="text-zinc-500">{username?.length || 0}/{MAX_USERNAME}</span>
          </div>

          {/* 한줄 소개 */}
          <label className="block text-sm font-medium mb-1">한줄 소개 *</label>
          <input
            value={intro}
            onChange={(event) => setIntro(event.target.value)}
            placeholder="예) 프론트엔드 개발자, 사용자 경험을 중시합니다"
            maxLength={MAX_INTRO}
            className="w-full rounded-xl border px-3 py-2 text-sm mb-1"
          />
          <div className="flex justify-between text-xs mb-4">
            <span className="text-red-600">{errors.intro || "\u00A0"}</span>
            <span className="text-zinc-500">{intro?.length || 0}/{MAX_INTRO}</span>
          </div>


          {/* 기술 스택 */}
          <label className="block text-sm font-medium mb-1">기술 스택</label>
          <input
            value={skillsText}
            onChange={(event) => setSkillsText(event.target.value)}
            placeholder="React, TypeScript, Node.js"
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
          <div className="mt-2 flex flex-wrap gap-2 mb-6">
            {skillsText.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0).length > 0 ? (
              skillsText.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0).map((skillText, skillIndex) => (
                <span key={`${skillText}-${skillIndex}`} className="rounded bg-zinc-100 px-2.5 py-1 text-xs">
                  {skillText}
                </span>
              ))
            ) : (
              <span className="text-xs text-zinc-500">콤마(,)로 구분해 입력하세요. (최대 15개)</span>
            )}
          </div>

          {/* 기본 정보 */}
          <div className="grid gap-4 sm:grid-cols-2 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">작업 방식 *</label>
              <select
                value={workStyle}
                onChange={(event) => setWorkStyle(event.target.value)}
                className="w-full rounded-xl border px-3 py-2 text-sm"
              >
                <option value="">선택하세요</option>
                {WORK_STYLE_OPTIONS.map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
              <div className="mt-1 text-xs text-red-600">{errors.workStyle}</div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">협업 기간 *</label>
              <select
                value={collaborationPeriod}
                onChange={(event) => setCollaborationPeriod(event.target.value)}
                className="w-full rounded-xl border px-3 py-2 text-sm"
              >
                <option value="">선택하세요</option>
                {COLLABORATION_PERIOD_OPTIONS.map((period) => (
                  <option key={period} value={period}>{period}</option>
                ))}
              </select>
              <div className="mt-1 text-xs text-red-600">{errors.collaborationPeriod}</div>
            </div>
          </div>


          {/* 연락 수단 */}
          <div className="grid gap-4 sm:grid-cols-3 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">연락 수단 *</label>
              <select
                value={contactType}
                onChange={(event) => setContactType(event.target.value)}
                className="w-full rounded-xl border px-3 py-2 text-sm"
              >
                <option value="email">이메일</option>
                <option value="discord">디스코드</option>
                <option value="kakao">카카오톡</option>
                <option value="telegram">텔레그램</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">연락처 *</label>
              <input
                value={contactValue}
                onChange={(event) => setContactValue(event.target.value)}
                placeholder="예) example@email.com / username#1234 / 카카오ID"
                className="w-full rounded-xl border px-3 py-2 text-sm"
              />
              <div className="mt-1 text-xs text-red-600">{errors.contactValue}</div>
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
              onClick={() => navigate("/users")}
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
