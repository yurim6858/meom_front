import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function MatchingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [posting, setPosting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 상세 조회
  useEffect(() => {
    const fetchPosting = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`http://localhost:8080/api/recruitments/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("NOT_FOUND");
          }
          throw new Error("네트워크 오류");
        }
        const data = await res.json();
        setPosting(data);
      } catch (err) {
        console.error("공고 상세 조회 실패:", err);
        setError(err.message === "NOT_FOUND" ? "NOT_FOUND" : "공고를 불러오는데 실패했습니다.");
        setPosting(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPosting();
    }
  }, [id]);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleDelete = async () => {
    if (!confirm("정말로 이 공고를 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/recruitments/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("삭제에 실패했습니다.");
        return;
      }

      alert("공고가 삭제되었습니다.");
      navigate("/recruitments");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <section className="scroll-mt-[72px]">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="flex justify-center items-center">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-sm text-zinc-600 dark:text-zinc-400">공고를 불러오는 중...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error === "NOT_FOUND" || !posting) {
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

  const uniqueTags = Array.from(new Set(posting.tags || []));

  return (
    <section className="scroll-mt-[72px] bg-gray-50 min-h-screen dark:bg-gray-900">
      <div className="container max-w-[1280px] mx-auto px-4 py-8">
        {/* 상단 네비게이션 */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/recruitments")}
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
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                      {posting.title}
                    </h1>
                    {posting.intro && (
                      <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        {posting.intro}
                      </p>
                    )}
                  </div>
                  <div className="ml-6 flex flex-col items-end gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {posting.workStyle || "협업방식 미정"}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      마감일: {posting.deadline ?? "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 프로젝트 설명 카드 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">프로젝트 소개</h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {posting.description}
                  </p>
                </div>
              </div>
            </div>

            {/* 태그 카드 - 가독성 개선 */}
            {uniqueTags.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">기술 스택</h2>
                  <div className="flex flex-wrap gap-3">
                    {uniqueTags.map((tag, i) => (
                      <span
                        key={`${posting.id}-${tag}-${i}`}
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 모집 정보 카드 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">모집 정보</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 모집 포지션 */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      모집 포지션
                    </h3>
                    {posting.positions && posting.positions.length > 0 ? (
                      <div className="space-y-2">
                        {posting.positions.map((position, i) => (
                          <div
                            key={`${posting.id}-position-${i}`}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <span className="font-medium text-gray-900 dark:text-white">{position.role}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-300">{position.headcount}명</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">등록된 포지션이 없습니다.</p>
                    )}
                  </div>

                  {/* 협업 정보 */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      협업 정보
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">협업 방식</span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {posting.workStyle || "미정"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">협업 기간</span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {posting.collaborationPeriod || "미정"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 작성자 정보 카드 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">작성자</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {posting.username ? posting.username.charAt(0).toUpperCase() : "?"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{posting.username ?? "알 수 없음"}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">프로젝트 리더</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 연락 정보 카드 */}
            {posting.contactType && posting.contactValue && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">연락처</h3>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{posting.contactType}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{posting.contactValue}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 액션 버튼 카드 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6">
                <div className="space-y-3">
                  <button
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md dark:bg-gray-500 dark:hover:bg-gray-600"
                    onClick={() => alert("지원 폼은 추후 연결됩니다.")}
                  >
                    이 팀에 지원하기
                  </button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      onClick={() => navigate(`/recruitments/${id}/edit`)}
                    >
                      수정
                    </button>
                    <button
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      onClick={handleDelete}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

