import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const MAX_USERNAME = 20;
const MAX_INTRO = 100;
const MAX_BIO = 1000;
const SKILL_PRESET = ["React", "Vue", "Angular", "TypeScript", "JavaScript", "Node.js", "Python", "Java", "Spring Boot", "Django", "Flask", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Git", "Figma", "Photoshop", "Illustrator"];

export default function UserEditPage() {
  const { id } = useParams();
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
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});

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
        
        // 로컬 스토리지에서 유저 데이터 가져오기
        const savedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        const foundUser = savedUsers.find(u => u.id === parseInt(id));
        
        if (!foundUser) {
          alert('유저 정보를 찾을 수 없습니다.');
          navigate('/users');
          return;
        }
        
        // 본인의 프로필인지 확인
        if (foundUser.id !== currentUser.id) {
          alert('본인의 프로필만 수정할 수 있습니다.');
          navigate('/users');
          return;
        }
        
        // 기존 데이터로 폼 채우기
        setName(foundUser.name || "");
        setIntro(foundUser.intro || "");
        setBio(foundUser.bio || "");
        setSkillsText(foundUser.skills ? foundUser.skills.join(", ") : "");
        setExperience(foundUser.experience || "");
        setLocation(foundUser.location || "");
        setAvailability(foundUser.availability || "");
        setPortfolio(foundUser.portfolio || "");
        setContactType(foundUser.contactType || "email");
        setContactValue(foundUser.contactValue || "");
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        alert("데이터를 불러오는데 실패했습니다.");
        navigate("/users");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, currentUser, navigate]);

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

  const validateForm = () => {
    const nextErrors = {};

    if (!name.trim()) nextErrors.name = "이름을 입력해 주세요.";
    if (!intro.trim()) nextErrors.intro = "한 줄 소개를 입력해 주세요.";
    if (!bio.trim()) nextErrors.bio = "자기소개를 입력해 주세요.";
    if (!experience) nextErrors.experience = "경력을 선택해 주세요.";
    if (!location) nextErrors.location = "지역을 선택해 주세요.";
    if (!availability) nextErrors.availability = "협업 가능 시간을 선택해 주세요.";
    if (!contactValue.trim()) nextErrors.contactValue = "연락처를 입력해 주세요.";

    if (name.length > MAX_USERNAME) nextErrors.name = `이름은 ${MAX_USERNAME}자 이하로 입력해 주세요.`;
    if (intro.length > MAX_INTRO) nextErrors.intro = `한 줄 소개는 ${MAX_INTRO}자 이하로 입력해 주세요.`;
    if (bio.length > MAX_BIO) nextErrors.bio = `자기소개는 ${MAX_BIO}자 이하로 입력해 주세요.`;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 로컬 스토리지에서 기존 유저 목록 가져오기
      const savedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      
      // 현재 유저 정보 업데이트
      const updatedUsers = savedUsers.map(user => {
        if (user.id === parseInt(id)) {
          return {
            ...user,
            name: name.trim(),
            intro: intro.trim(),
            bio: bio.trim(),
            skills: skills,
            experience,
            location,
            availability,
            portfolio: portfolio.trim(),
            contactType,
            contactValue: contactValue.trim(),
            updatedAt: new Date().toISOString()
          };
        }
        return user;
      });
      
      // 로컬 스토리지에 저장
      localStorage.setItem('mockUsers', JSON.stringify(updatedUsers));
      
      alert('프로필이 성공적으로 수정되었습니다!');
      navigate(`/users/${id}`);
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      alert("프로필 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">프로필 수정</h1>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 기본 정보 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">기본 정보</h2>
                
                {/* 이름 */}
                <div className="mb-6">
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
                  {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                </div>

                {/* 한 줄 소개 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">한 줄 소개 *</label>
                  <input
                    value={intro}
                    onChange={(event) => setIntro(event.target.value)}
                    placeholder="자신을 한 줄로 소개해주세요"
                    className="w-full rounded-xl border px-3 py-2 text-sm mb-1"
                    maxLength={MAX_INTRO}
                  />
                  <div className="flex justify-between text-xs mb-4">
                    <span className="text-zinc-500">간단한 자기소개를 입력해주세요</span>
                    <span className="text-zinc-500">{intro.length}/{MAX_INTRO}</span>
                  </div>
                  {errors.intro && <p className="text-red-500 text-xs">{errors.intro}</p>}
                </div>

                {/* 자기소개 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">자기소개 *</label>
                  <textarea
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    placeholder="자신의 경험, 관심사, 목표 등을 자유롭게 작성해주세요"
                    className="w-full rounded-xl border px-3 py-2 text-sm mb-1 h-32 resize-none"
                    maxLength={MAX_BIO}
                  />
                  <div className="flex justify-between text-xs mb-4">
                    <span className="text-zinc-500">상세한 자기소개를 작성해주세요</span>
                    <span className="text-zinc-500">{bio.length}/{MAX_BIO}</span>
                  </div>
                  {errors.bio && <p className="text-red-500 text-xs">{errors.bio}</p>}
                </div>
              </div>

              {/* 기술 스택 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">기술 스택</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">보유 기술</label>
                  <input
                    value={skillsText}
                    onChange={(event) => setSkillsText(event.target.value)}
                    placeholder="React, TypeScript, Node.js (쉼표로 구분)"
                    className="w-full rounded-xl border px-3 py-2 text-sm mb-1"
                  />
                  <div className="text-xs text-zinc-500 mb-4">
                    보유하고 있는 기술을 쉼표로 구분하여 입력해주세요 (최대 15개)
                  </div>
                  
                  {/* 기술 프리셋 */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">추천 기술</p>
                    <div className="flex flex-wrap gap-2">
                      {SKILL_PRESET.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => {
                            const currentSkills = skillsText.split(",").map(s => s.trim()).filter(s => s);
                            if (!currentSkills.includes(skill)) {
                              setSkillsText([...currentSkills, skill].join(", "));
                            }
                          }}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* 선택된 기술 표시 */}
                  {skills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">선택된 기술</p>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 경험 및 정보 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">경험 및 정보</h2>
                
                <div className="grid gap-4 sm:grid-cols-3 mb-6">
                  {/* 경력 */}
                  <div>
                    <label className="block text-sm font-medium mb-1">경력 *</label>
                    <select
                      value={experience}
                      onChange={(event) => setExperience(event.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-sm"
                    >
                      <option value="">선택해주세요</option>
                      {EXPERIENCE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
                  </div>

                  {/* 지역 */}
                  <div>
                    <label className="block text-sm font-medium mb-1">지역 *</label>
                    <select
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-sm"
                    >
                      <option value="">선택해주세요</option>
                      {LOCATION_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                  </div>

                  {/* 협업 가능 시간 */}
                  <div>
                    <label className="block text-sm font-medium mb-1">협업 가능 시간 *</label>
                    <select
                      value={availability}
                      onChange={(event) => setAvailability(event.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-sm"
                    >
                      <option value="">선택해주세요</option>
                      {AVAILABILITY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.availability && <p className="text-red-500 text-xs mt-1">{errors.availability}</p>}
                  </div>
                </div>

                {/* 포트폴리오 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">포트폴리오 링크</label>
                  <input
                    value={portfolio}
                    onChange={(event) => setPortfolio(event.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full rounded-xl border px-3 py-2 text-sm mb-1"
                  />
                  <div className="text-xs text-zinc-500 mb-4">
                    GitHub, 포트폴리오 사이트 등의 링크를 입력해주세요
                  </div>
                </div>
              </div>

              {/* 연락처 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">연락처</h2>
                
                <div className="grid gap-4 sm:grid-cols-2 mb-6">
                  {/* 연락 수단 */}
                  <div>
                    <label className="block text-sm font-medium mb-1">연락 수단</label>
                    <select
                      value={contactType}
                      onChange={(event) => setContactType(event.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-sm"
                    >
                      <option value="email">이메일</option>
                      <option value="discord">Discord</option>
                      <option value="telegram">Telegram</option>
                      <option value="kakao">카카오톡</option>
                    </select>
                  </div>

                  {/* 연락처 */}
                  <div>
                    <label className="block text-sm font-medium mb-1">연락처 *</label>
                    <input
                      value={contactValue}
                      onChange={(event) => setContactValue(event.target.value)}
                      placeholder={contactType === "email" ? "example@email.com" : "연락처를 입력해주세요"}
                      className="w-full rounded-xl border px-3 py-2 text-sm"
                    />
                    {errors.contactValue && <p className="text-red-500 text-xs mt-1">{errors.contactValue}</p>}
                  </div>
                </div>
              </div>

              {/* 제출 버튼 */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(`/users/${id}`)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? "수정 중..." : "수정하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
