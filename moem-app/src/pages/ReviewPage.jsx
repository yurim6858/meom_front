import React, { useState } from "react";



export default function ReviewPage() {
  const [q1, setQ1] = useState(null);
  const [q2, setQ2] = useState(null);
  const [q3, setQ3] = useState(null);
  const [comments, setComments] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [showToast, setShowToast] = useState("");

  const resetForm = () => {
    setQ1(null);
    setQ2(null);
    setQ3(null);
    setComments("");
  };

  const validate = () => {
    return q1 && q2 && q3;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setTimeout(() => setShowToast(""), 2500);
      return;
    }

    const entry = {
      id: Date.now(),
      q1: Number(q1),
      q2: Number(q2),
      q3: Number(q3),
      comments: comments.trim(),
      average: ((Number(q1) + Number(q2) + Number(q3)) / 3).toFixed(2),
      submittedAt: new Date().toISOString(),
    };

    setSubmissions((s) => [entry, ...s]);
    resetForm();
    setShowToast("제출이 완료되었습니다.");
    setTimeout(() => setShowToast(""), 2000);
  };

  const downloadJSON = (item) => {
    const payload = item || { submissions };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `team-evaluation-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    if (submissions.length === 0) return;
    const header = ["id", "q1", "q2", "q3", "average", "comments", "submittedAt"];
    const rows = submissions.map((s) => [s.id, s.q1, s.q2, s.q3, s.average, `"${(s.comments || "").replace(/"/g, '""')}"`, s.submittedAt]);
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `team-evaluations-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-4">
        {/* <div className="w-12 h-12 rounded-xl grid place-items-center text-white font-bold"></div> */}
        <div>
          <h1 className="text-xl font-semibold">팀원 평가 페이지</h1>
          <p className="text-sm text-gray-500">핵심 질문(성과 · 협력 · 태도)과 기타 의견을 제출할 수 있는 평가 폼입니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-2xl p-6 space-y-6">
        {/* Q1 */}
        <fieldset>
          <legend className="font-semibold mb-2">1) 이 팀원이 맡은 역할과 과제를 책임감 있게 잘 수행했는가?</legend>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((v) => (
              <label key={v} className={`flex-1 cursor-pointer p-3 rounded-lg border ${q1 == v ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "bg-gray-50 border-gray-200"} text-center`}> 
                <input className="hidden" type="radio" name="q1" value={v} checked={q1 == v} onChange={() => setQ1(v)} />
                <div className="text-sm font-medium">{v}</div>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Q2 */}
        <fieldset>
          <legend className="font-semibold mb-2">2) 팀워크와 협업 과정에서 긍정적으로 기여했는가?</legend>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((v) => (
              <label key={v} className={`flex-1 cursor-pointer p-3 rounded-lg border ${q2 == v ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "bg-gray-50 border-gray-200"} text-center`}> 
                <input className="hidden" type="radio" name="q2" value={v} checked={q2 == v} onChange={() => setQ2(v)} />
                <div className="text-sm font-medium">{v}</div>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Q3 */}
        <fieldset>
          <legend className="font-semibold mb-2">3) 태도(성실성·열정·소통) 측면에서 신뢰할 수 있었는가?</legend>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((v) => (
              <label key={v} className={`flex-1 cursor-pointer p-3 rounded-lg border ${q3 == v ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "bg-gray-50 border-gray-200"} text-center`}> 
                <input className="hidden" type="radio" name="q3" value={v} checked={q3 == v} onChange={() => setQ3(v)} />
                <div className="text-sm font-medium">{v}</div>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Comments */}
        <div>
          <label className="font-semibold mb-2 block">기타 의견 (선택)</label>
          <textarea value={comments} onChange={(e) => setComments(e.target.value)} rows={5} className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50" placeholder="팀원에 대한 자유로운 평가나 개선 제안을 적어주세요."></textarea>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">제출</button>
          <button type="button" onClick={resetForm} className="px-3 py-2 border rounded-lg text-gray-700">초기화</button>
        </div>

        {showToast && (
          <div className="rounded-md bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-2 text-sm">{showToast}</div>
        )}
      </form>

      {/* Submissions list */}
      <section className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">제출 내역 ({submissions.length})</h2>
      
        </div>

        <div className="space-y-3">
          {submissions.length === 0 && (
            <div className="text-sm text-gray-500">아직 제출된 평가가 없습니다.</div>
          )}

          {submissions.map((s) => (
            <article key={s.id} className="p-3 bg-white border rounded-lg shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-md bg-gray-100 grid place-items-center font-medium">{s.average}</div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600">{new Date(s.submittedAt).toLocaleString()}</div>
                  <div className="mt-1 text-sm">Q1: {s.q1} · Q2: {s.q2} · Q3: {s.q3}</div>
                  {s.comments && <div className="mt-2 text-sm text-gray-700">{s.comments}</div>}
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => navigator.clipboard?.writeText(JSON.stringify(s, null, 2))} className="text-xs px-2 py-1 border rounded">복사</button>
                  <button onClick={() => downloadJSON(s)} className="text-xs px-2 py-1 border rounded">JSON</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
