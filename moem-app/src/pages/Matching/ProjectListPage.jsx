import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DdayBadge from "../../components/shared/DdayBadge";
import InitialBadge from "../../components/shared/InitialBadge";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import SearchInput from "../../components/shared/SearchInput";
import { ProjectAPI } from "../../services/api/index";

const ProjectListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [postings, setPostings] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const projectAPI = new ProjectAPI();

  useEffect(() => {
    const fetchPostings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        
        const data = await projectAPI.getProjects();
        setPostings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("공고 불러오기 실패:", err);
        setError(err.message || "공고를 불러오는데 실패했습니다.");
        setPostings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPostings();
  }, []);

  const filteredPostings = useMemo(() => {
    const searchKeyword = searchQuery.trim().toLowerCase();
    if (!searchKeyword) return postings;

    return postings.filter((posting) => {
      const titleMatch = posting.title?.toLowerCase().includes(searchKeyword);
      const introMatch = posting.intro?.toLowerCase().includes(searchKeyword);
      const descMatch = posting.description?.toLowerCase().includes(searchKeyword);
      const tagsMatch = (posting.tags || []).some((tag) =>
        tag?.toLowerCase().includes(searchKeyword)
      );
      const usernameMatch = posting.username?.toLowerCase().includes(searchKeyword);
      return titleMatch || introMatch || descMatch || tagsMatch || usernameMatch;
    });
  }, [postings, searchQuery]);

  const handleCardClick = (id) => {
    navigate(`/project-posts/${id}`);
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

  if (error) {
    return (
      <section className="scroll-mt-[72px]">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="scroll-mt-[72px]">
      <div className="container max-w-[1280px] mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">매칭 공고</h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              같이 프로젝트하고 싶은 사람을 찾아보세요. (제목, 소개, 기술, 작성자)
            </p>
          </div>
          <button
            onClick={() => navigate("/project-posts/new")}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            공고 등록
          </button>
        </div>

        {/* 검색 */}
        <div className="mb-6">
          <SearchInput
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="프로젝트명, 기술스택, 작성자로 검색..."
          />
        </div>

        {/* 공고 목록 */}
        {filteredPostings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-4">
              {searchQuery ? "검색 결과가 없습니다." : "등록된 공고가 없습니다."}
            </div>
            {!searchQuery && (
              <button
                onClick={() => navigate("/project-posts/new")}
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                첫 공고 등록하기
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {filteredPostings.map((posting) => (
              <div
                key={posting.id}
                onClick={() => handleCardClick(posting.id)}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="p-6">
                  {/* 헤더 */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <InitialBadge name={posting.username} />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {posting.username}
                        </p>
                      </div>
                    </div>
                    <DdayBadge dateStr={posting.deadline} />
                  </div>

                  {/* 제목 */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {posting.title}
                  </h3>

                  {/* 소개 */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {posting.intro}
                  </p>

                  {/* 태그 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(posting.tags || []).slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {(posting.tags || []).length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md text-xs">
                        +{(posting.tags || []).length - 3}
                      </span>
                    )}
                  </div>

                  {/* 협업 방식 */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{posting.workStyle}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectListPage;