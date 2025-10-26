import React, { useState, useEffect } from "react"; 

export default function ProfileDetailModal({ profile, onClose }) {

  const [aiReason, setAiReason] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (!profile) {
      setAiReason(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const fetchAiReason = async () => {
      setIsLoading(true);
      setError(null);
      setAiReason(null);

      try {
        const response = await fetch(`/api/match/reason?userId=${profile.id}`);
        if (!response.ok) {
          throw new Error('서버에서 응답을 받지 못했습니다.');
        }
        const data = await response.json();
        setAiReason(data.reason);
      } catch (err) {
        console.error("Failed to fetch AI reason:", err);
        setError("AI 추천 이유를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAiReason();

  }, [profile]);

  if (!profile) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 relative animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-slate-600">{profile.role}</p>
          </div>
          <hr />
          <div className="text-sm space-y-2">
            <p><strong> 지역:</strong> {profile.location}</p>
            <p><strong> 학교:</strong> {profile.university}</p>
            <p><strong> 소개:</strong> {profile.note}</p>
          </div>

          {isLoading && (
            <div className="p-3 bg-slate-50/70 border border-slate-200 rounded-lg mt-2">
              <h3 className="font-semibold mb-1 text-slate-600">💡 AI 추천 요약 (분석 중...)</h3>
              <div className="space-y-1.5 animate-pulse">
                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50/70 border border-red-200 rounded-lg mt-2">
              <h3 className="font-semibold mb-1 text-red-700">💡 AI 추천 요약 (오류)</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {aiReason && !isLoading && (
            <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-lg mt-2">
              <h3 className="font-semibold mb-1 text-teal-800">💡 AI 추천 요약</h3>
              <p className="text-sm text-slate-700">{aiReason}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">보유 기술</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((skill) => (
                <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}