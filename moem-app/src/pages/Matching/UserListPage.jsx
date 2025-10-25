import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchInput from "../../components/shared/SearchInput";
import { UserAPI } from "../../services/api/index";

const UserListPage = () => {
  const navigate = useNavigate();
  const userAPI = new UserAPI();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);

  // 컴포넌트 마운트 시 API에서 유저 데이터 로드
  useEffect(() => {
    const loadUsers = async () => {
      try {
        
        const savedUsers = await userAPI.getUsers();
        setUsers(savedUsers);
      } catch (error) {
        console.error('사용자 목록 로드 실패:', error);
        alert('사용자를 불러오는데 실패했습니다.');
      }
    };
    
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return users;

    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(keyword) ||
        (user.intro || "").toLowerCase().includes(keyword) ||
        (user.skills || []).some((s) => s.toLowerCase().includes(keyword))
    );
  }, [query, users]);


  const handleUserClick = (user) => {
    navigate(`/users/${user.id}`);
  };

  return (
    <section className="scroll-mt-[72px]">
      <div className="container max-w-[1280px] mx-auto px-4 py-8 sm:py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">유저 탐색</h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              같이 프로젝트하고 싶은 사람을 찾아보세요. (닉네임, 소개, 기술)
            </p>
          </div>
          <button
            onClick={() => navigate("/users/register")}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            프로필 등록
          </button>
        </div>

        <div className="mb-6">
          <SearchInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="검색: 닉네임, 소개, 기술..."
          />
        </div>

        <div className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
          총 <span className="font-medium">{filtered.length}</span>명
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 p-10 text-center text-sm text-zinc-500 dark:border-white/10">
            조건에 맞는 유저가 없어요.
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-1">
            {filtered.map((user) => (
              <li
                key={user.id}
                onClick={() => handleUserClick(user)}
                className="group cursor-pointer rounded-2xl border border-black/10 bg-white/60 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-900/60"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                    {user.username?.[0] ?? "?"}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold leading-tight">{user.username}</h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2">
                      {user.intro}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(user.skills || []).map((skill, idx) => (
                    <span
                      key={`${user.id}-${skill}-${idx}`}
                      className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700 transition group-hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:group-hover:bg-zinc-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-end">
                  <div className="text-xs text-zinc-500 opacity-0 transition group-hover:opacity-100">
                    상세보기 →
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

      </div>
    </section>
  );
};

export default UserListPage;
