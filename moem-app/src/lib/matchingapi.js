import { MOCK_USERS } from "./mockUsers100";

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
