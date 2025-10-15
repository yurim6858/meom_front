import React from "react";

export default function ProfileDetailModal({ profile, onClose }) {
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
          {profile.recommendationReason && (
            <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-lg mt-2">
              <h3 className="font-semibold mb-1 text-teal-800">💡 AI 추천 요약</h3>
              <p className="text-sm text-slate-700">{profile.recommendationReason}</p>
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