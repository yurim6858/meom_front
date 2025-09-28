import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const MAX_USERNAME = 20;
const MAX_INTRO = 100;
const MAX_BIO = 1000;
const SKILL_PRESET = ["React", "Vue", "Angular", "TypeScript", "JavaScript", "Node.js", "Python", "Java", "Spring Boot", "Django", "Flask", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Git", "Figma", "Photoshop", "Illustrator"];

export default function UserCreatePage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [name, setName] = useState("");
  const [intro, setIntro] = useState("");
  const [bio, setBio] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [contactType, setContactType] = useState("email");
  const [contactValue, setContactValue] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      // 이미 등록된 프로필이 있는지 확인
      const savedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      const existingProfile = savedUsers.find(user => user.id === currentUser.id);
      
      if (existingProfile) {
        alert('이미 등록된 프로필이 있습니다. 수정하려면 프로필 상세 페이지에서 수정 버튼을 클릭하세요.');
        navigate('/users');
        return;
      }
      
      // 로그인한 사용자 정보로 자동 채우기
      setName(currentUser.name);
      setContactValue(currentUser.email);
    }
  }, [currentUser, navigate]);

  const skills = Array.from(
    new Set(
      skillsText
        .split(",")
        .map((raw) => raw.trim())
        .filter((raw) => raw.length > 0)
    )
  ).slice(0, 15);

  const EXPERIENCE_OPTIONS = ["신입", "1년", "2년", "3년", "4년", "5년", "6년", "7년", "8년", "9년", "10년 이상"];
  const LOCATION_OPTIONS = ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주", "해외"];
  const AVAILABILITY_OPTIONS = ["주 1-2회", "주 3-4회", "주 5회 이상", "주말만", "평일만", "시간 협의"];

  // 등록 제출
  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    if (!name.trim()) nextErrors.name = "이름을 입력해 주세요.";
    else if (name.trim().length > MAX_USERNAME) nextErrors.name = `이름은 최대 ${MAX_USERNAME}자입니다.`;

    if (!intro.trim()) nextErrors.intro = "한줄 소개를 입력해 주세요.";
    else if (intro.trim().length > MAX_INTRO) nextErrors.intro = `한줄 소개는 최대 ${MAX_INTRO}자입니다.`;

    if (!bio.trim()) nextErrors.bio = "자기소개를 입력해 주세요.";
    else if (bio.trim().length > MAX_BIO) nextErrors.bio = `자기소개는 최대 ${MAX_BIO}자입니다.`;

    if (!experience) nextErrors.experience = "경력을 선택해 주세요.";
    if (!location) nextErrors.location = "위치를 선택해 주세요.";
    if (!availability) nextErrors.availability = "협업 가능 시간을 선택해 주세요.";
    if (!contactValue.trim()) nextErrors.contactValue = "연락처를 입력해 주세요.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      
      // 임시로 로컬 스토리지에 저장 (실제 API 연결 시 수정 필요)
      const userData = {
        id: currentUser.id, // 로그인한 사용자의 ID 사용
        username: name, // 이름을 username으로 사용
        name: name,
        intro,
        bio,
        skills,
        experience,
        location,
        availability,
        portfolio,
        contactType,
        contactValue,
        createdAt: new Date().toISOString()
      };

      // 로컬 스토리지에서 기존 유저 목록 가져오기
      const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      existingUsers.push(userData);
      localStorage.setItem('mockUsers', JSON.stringify(existingUsers));

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
          {/* 이름 */}
          <label className="block text-sm font-medium mb-1">이름 *</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border px-3 py-2 text-sm mb-1 bg-gray-50"
            disabled
          />
          <div className="flex justify-between text-xs mb-4">
            <span className="text-blue-600">로그인한 사용자의 이름이 자동으로 입력됩니다</span>
            <span className="text-zinc-500">{name.length}/{MAX_USERNAME}</span>
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
            <span className="text-zinc-500">{intro.length}/{MAX_INTRO}</span>
          </div>

          {/* 자기소개 */}
          <label className="block text-sm font-medium mb-1">자기소개 *</label>
          <textarea
            rows={6}
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder="자신의 경험, 관심사, 협업 스타일 등을 자세히 적어주세요."
            maxLength={MAX_BIO}
            className="w-full rounded-xl border px-3 py-2 text-sm mb-1"
          />
          <div className="flex justify-between text-xs mb-4">
            <span className="text-red-600">{errors.bio || "\u00A0"}</span>
            <span className="text-zinc-500">{bio.length}/{MAX_BIO}</span>
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
            {skills.length > 0 ? (
              skills.map((skillText, skillIndex) => (
                <span key={`${skillText}-${skillIndex}`} className="rounded bg-zinc-100 px-2.5 py-1 text-xs">
                  {skillText}
                </span>
              ))
            ) : (
              <span className="text-xs text-zinc-500">콤마(,)로 구분해 입력하세요. (최대 15개)</span>
            )}
          </div>

          {/* 기본 정보 */}
          <div className="grid gap-4 sm:grid-cols-3 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">경력 *</label>
              <select
                value={experience}
                onChange={(event) => setExperience(event.target.value)}
                className="w-full rounded-xl border px-3 py-2 text-sm"
              >
                <option value="">선택하세요</option>
                {EXPERIENCE_OPTIONS.map((exp) => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
              <div className="mt-1 text-xs text-red-600">{errors.experience}</div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">위치 *</label>
              <select
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="w-full rounded-xl border px-3 py-2 text-sm"
              >
                <option value="">선택하세요</option>
                {LOCATION_OPTIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <div className="mt-1 text-xs text-red-600">{errors.location}</div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">협업 가능 시간 *</label>
              <select
                value={availability}
                onChange={(event) => setAvailability(event.target.value)}
                className="w-full rounded-xl border px-3 py-2 text-sm"
              >
                <option value="">선택하세요</option>
                {AVAILABILITY_OPTIONS.map((avail) => (
                  <option key={avail} value={avail}>{avail}</option>
                ))}
              </select>
              <div className="mt-1 text-xs text-red-600">{errors.availability}</div>
            </div>
          </div>

          {/* 포트폴리오 */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">포트폴리오 (선택)</label>
            <input
              value={portfolio}
              onChange={(event) => setPortfolio(event.target.value)}
              placeholder="예) https://github.com/username"
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
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
