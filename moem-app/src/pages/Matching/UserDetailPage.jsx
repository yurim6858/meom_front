import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 유저 상세 조회
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 로컬 스토리지에서 유저 데이터 가져오기
        const savedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        const foundUser = savedUsers.find(u => u.id === parseInt(id));
        
        if (foundUser) {
          setUser(foundUser);
        } else {
          // 기본 목업 데이터 (ID가 1, 2인 경우)
          const defaultUsers = {
            1: {
              id: 1,
              username: "민지",
              intro: "프론트엔드 위주, 디자인 시스템 좋아해요. 사용자 경험을 중시하며 깔끔한 코드를 추구합니다.",
              skills: ["React", "TypeScript", "TailwindCSS", "Next.js", "Figma"],
              experience: "3년",
              location: "서울",
              availability: "주 3-4회",
              portfolio: "https://github.com/minji-dev",
              contactType: "email",
              contactValue: "minji@example.com",
              bio: `안녕하세요! 프론트엔드 개발자 민지입니다.

주로 React와 TypeScript를 사용하여 웹 애플리케이션을 개발하고 있습니다. 
사용자 경험을 중시하며, 깔끔하고 유지보수하기 쉬운 코드를 작성하는 것을 목표로 합니다.

최근에는 디자인 시스템 구축과 컴포넌트 최적화에 관심이 많습니다.
함께 의미있는 프로젝트를 만들어가고 싶습니다!`,
              projects: [
                {
                  name: "E-commerce Platform",
                  description: "React와 TypeScript로 개발한 온라인 쇼핑몰",
                  tech: ["React", "TypeScript", "Redux", "Styled Components"]
                },
                {
                  name: "Task Management App",
                  description: "팀 협업을 위한 태스크 관리 애플리케이션",
                  tech: ["Next.js", "Prisma", "PostgreSQL", "TailwindCSS"]
                }
              ]
            },
            2: {
              id: 2,
              username: "현수",
              intro: "백엔드/인프라 관심. 성능 최적화 좋아합니다.",
              skills: ["Spring Boot", "JPA", "AWS", "Docker", "Kubernetes"],
              experience: "5년",
              location: "경기",
              availability: "주 5회 이상",
              portfolio: "https://github.com/hyunsoo-dev",
              contactType: "discord",
              contactValue: "hyunsoo#1234",
              bio: `안녕하세요! 백엔드 개발자 현수입니다.

Spring Boot와 JPA를 주로 사용하여 백엔드 시스템을 개발하고 있습니다.
성능 최적화와 확장 가능한 아키텍처 설계에 관심이 많습니다.

최근에는 클라우드 인프라와 DevOps에 집중하고 있으며,
안정적이고 효율적인 시스템 구축을 목표로 합니다.`,
              projects: [
                {
                  name: "Microservices Platform",
                  description: "Spring Boot 기반 마이크로서비스 아키텍처",
                  tech: ["Spring Boot", "Docker", "Kubernetes", "Redis"]
                },
                {
                  name: "API Gateway",
                  description: "대용량 트래픽 처리를 위한 API 게이트웨이",
                  tech: ["Spring Cloud Gateway", "Redis", "AWS"]
                }
              ]
            }
          };
          
          const defaultUser = defaultUsers[parseInt(id)];
          if (defaultUser) {
            setUser(defaultUser);
          } else {
            throw new Error("NOT_FOUND");
          }
        }
      } catch (err) {
        console.error("유저 상세 조회 실패:", err);
        setError(err.message === "NOT_FOUND" ? "NOT_FOUND" : "유저 정보를 불러오는데 실패했습니다.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleMessage = () => {
    alert(`${user.username}님에게 메시지를 보낼 수 있는 기능은 곧 연결됩니다!`);
  };

  if (loading) {
    return (
      <section className="scroll-mt-[72px]">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="flex justify-center items-center">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-sm text-zinc-600 dark:text-zinc-400">유저 정보를 불러오는 중...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error === "NOT_FOUND" || !user) {
    return (
      <section className="scroll-mt-[72px]">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-xl font-semibold">유저를 찾을 수 없습니다.</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            주소를 확인하거나 목록으로 돌아가세요.
          </p>
          <button
            onClick={() => navigate("/users")}
            className="mt-6 rounded-lg border border-black/10 px-4 py-2 text-sm hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-zinc-800"
          >
            ← 목록으로
          </button>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="scroll-mt-[72px]">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              다시 시도
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="scroll-mt-[72px] bg-gray-50 min-h-screen dark:bg-gray-900">
      <div className="container max-w-[1280px] mx-auto px-4 py-8">
        {/* 상단 네비게이션 */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/users")}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            목록으로 돌아가기
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 헤더 카드 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-2xl">
                        {user.username ? user.username.charAt(0).toUpperCase() : "?"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {user.username}
                      </h1>
                      {user.intro && (
                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                          {user.intro}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      경력 {user.experience}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      위치: {user.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 자기소개 카드 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">자기소개</h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {user.bio}
                  </p>
                </div>
              </div>
            </div>

            {/* 기술 스택 카드 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">기술 스택</h2>
                <div className="flex flex-wrap gap-3">
                  {(user.skills || []).map((skill, i) => (
                    <span
                      key={`${user.id}-${skill}-${i}`}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 프로젝트 경험 카드 */}
            {user.projects && user.projects.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">프로젝트 경험</h2>
                  <div className="space-y-6">
                    {user.projects.map((project, i) => (
                      <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {project.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.tech.map((tech, j) => (
                            <span
                              key={j}
                              className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 기본 정보 카드 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">기본 정보</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">경력</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {user.experience}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">위치</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {user.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">협업 가능</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {user.availability}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 포트폴리오 카드 */}
            {user.portfolio && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">포트폴리오</h3>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <a 
                      href={user.portfolio} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      GitHub 프로필 보기
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* 연락 정보 카드 */}
            {user.contactType && user.contactValue && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">연락처</h3>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.contactType}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{user.contactValue}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 액션 버튼 카드 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">액션</h3>
                <div className="space-y-3">
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                    onClick={handleMessage}
                  >
                    메시지 보내기
                  </button>
                  
                  <button
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                    onClick={() => alert("프로젝트 제안 기능은 추후 연결됩니다.")}
                  >
                    프로젝트 제안하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
