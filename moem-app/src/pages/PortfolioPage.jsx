import React, { useEffect, useState } from "react";


const PortfolioPage = () => {
const [score, setScore] = useState(82);
  const [qualifications, setQualifications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // 자격증 데이터
    setQualifications([
      { category: "어학", name: "TOEIC", score: 850 },
      { category: "IT", name: "정보처리기사", score: null },
    ]);

    // 프로젝트 데이터
    setProjects([
      {
        team: "모꼬지 프로젝트 팀",
        period: "2024.03 ~ 2024.08",
        result: "웹 서비스 개발 및 배포 완료",
      },
    ]);

    // 후기 데이터
    setReviews([
      { id: 1, content: "지원자의 문제 해결 능력이 인상적이었습니다." },
      { id: 2, content: "팀워크가 매우 뛰어납니다." },
      { id: 3, content: "프로젝트 수행 능력이 좋았습니다." },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 space-y-8">
      {/*게이지바 (점수 포함) */}
      <div className="w-full max-w-3xl relative">
        {/* 점수 텍스트 - 게이지바 위에 표시 */}
        <span className="absolute left-3 -top-6 text-sm font-semibold text-gray-700">
          현재 점수: {score} / 100
        </span>

        {/* 게이지바 자체 */}
        <div className="bg-gray-300 rounded-full h-6 overflow-hidden">
          <div
            className="h-6 bg-red-600 transition-all duration-500"
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>

      {/*  자격증 표 */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">자격증 정보</h2>
        <table className="w-full border-collapse text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">구분</th>
              <th className="border p-2">자격증 이름</th>
         
              <th className="border p-2">점수</th>
            </tr>
          </thead>
          <tbody>
            {qualifications.map((q, idx) => (
              <tr key={idx}>
                <td className="border p-2">{q.category}</td>
                <td className="border p-2">{q.name}</td>
                
                <td className="border p-2">
                  {q.score !== null ? q.score : "NULL"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*  프로젝트 표 */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">프로젝트 정보</h2>
        <table className="w-full border-collapse text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">프로젝트 팀</th>
              <th className="border p-2">기간</th>
              <th className="border p-2">프로젝트 결과</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p, idx) => (
              <tr key={idx}>
                <td className="border p-2">{p.team}</td>
                <td className="border p-2">{p.period}</td>
                <td className="border p-2">{p.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*  후기 섹션 */}
      <div className="w-full max-w-3xl">
  <h2 className="text-lg font-semibold mb-2 text-gray-800">후기</h2>
  <div className="grid grid-cols-3 gap-4">
    {reviews.map((r) => (
      <div
        key={r.id}
        className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-center text-center text-sm text-gray-700 min-h-[140px]"
      >
        {r.content}
      </div>
    ))}
  </div>
</div>

      {/*  점수 조절 버튼 */}
      <div className="flex space-x-3">
        <button
          onClick={() => setScore(Math.min(score + 10, 100))}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
        >
          점수 +
        </button>
        <button
          onClick={() => setScore(Math.max(score - 10, 0))}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
        >
          점수 -
        </button>
      </div>
    </div>
  )
}


export default PortfolioPage;