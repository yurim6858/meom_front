import { useMemo, useState } from "react";

export const MOCK_USERS = [
  {
    id: 1,
    username: "민지",
    intro: "프론트엔드 위주, 디자인 시스템 좋아해요.",
    skills: ["React", "TypeScript", "TailwindCSS"],
  },
  {
    id: 2,
    username: "현수",
    intro: "백엔드/인프라 관심. 성능 최적화 좋아합니다.",
    skills: ["Spring Boot", "JPA", "AWS"],
  },
];

const MatchingUserPage = () => {
  const [query, setQuery] = useState("");
  const [users] = useState(MOCK_USERS);

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

  const handleMessage = (user) => {
    alert(`${user.username}님에게 메시지를 보낼 수 있는 기능은 곧 연결됩니다!`);
  };

  return (
    <section className="scroll-mt-[72px]">
      <div className="container max-w-[1280px] mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">유저 탐색</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            같이 프로젝트하고 싶은 사람을 찾아보세요.
          </p>
        </div>

        <div className="mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색: 닉네임/소개/기술"
            className="w-full rounded-xl border border-black/10 bg-white py-3 px-3 text-base outline-none focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:bg-zinc-900"
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
                className="rounded-2xl border border-black/10 bg-white/60 p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900/60"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                    {user.username?.[0] ?? "?"}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">{user.username}</h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2">
                      {user.intro}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between">
                    <div className="mt-3 flex flex-wrap gap-2">
                        {(user.skills || []).map((skill, idx) => (
                            <span
                                key={`${user.id}-${skill}-${idx}`}
                                className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                            >
                            {skill}
                            </span>
                        ))}
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => handleMessage(user)}
                            className="rounded-xl bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                        >
                            메시지 보내기
                        </button>
                    </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default MatchingUserPage
