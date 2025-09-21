const MOCK_USERS = [
  {
    id: 1,
    name: "Kim",
    role: "Frontend Developer",
    university: "HUFS",
    location: "Seoul",
    skills: [
      { id: "react", label: "React" },
      { id: "ts", label: "TypeScript" },
      { id: "ui", label: "UX/UI" },
    ],
    matchScore: 89,
    note: "리액트/타입스크립트, 디지털 시스템 경험 우대",
  },
  {
    id: 2,
    name: "Lee",
    role: "Backend Developer",
    university: "KU Sejong",
    location: "Sejong",
    skills: [
      { id: "spring", label: "Spring" },
      { id: "mysql", label: "MySQL" },
      { id: "jpa", label: "JPA" },
    ],
    matchScore: 82,
    note: "스프링/도커, 팀 협업 주도",
  },
  {
    id: 3,
    name: "Park",
    role: "Product Designer",
    university: "CAU",
    location: "Daejeon",
    skills: [
      { id: "figma", label: "Figma" },
      { id: "ux", label: "UX" },
      { id: "ui", label: "UI" },
    ],
    matchScore: 76,
    note: "사용자 인터뷰/프로토타입 고도화",
  },
  {
    id: 4,
    name: "Jung",
    role: "iOS Engineer",
    university: "HKNU",
    location: "Seoul",
    skills: [
      { id: "swift", label: "Swift" },
      { id: "uikit", label: "UIKit" },
    ],
    matchScore: 71,
    note: "SwiftUI 학습 중, 팀 커뮤니케이션 강점",
  },
];


export async function getAiRecommendations(params) {

  const q = (params.q || "").trim().toLowerCase();
  const filtered = MOCK_USERS.filter((u) => {
    const matchQ = q
      ? [u.name, u.role, u.location, u.university, u.note].filter(Boolean).join(" ").toLowerCase().includes(q)
      : true;
    const matchSkills = params.skills?.length
      ? params.skills.every((sid) => u.skills.some((s) => s.id === sid))
      : true;
    return matchQ && matchSkills;
  });

  const shaped = filtered.map((u) => (params.tab === "ai" ? u : { ...u, matchScore: undefined }));
  await new Promise((r) => setTimeout(r, 300)); 
  return shaped.slice(0, params.limit || 12);
}
