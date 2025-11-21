import React from 'react'

export default function ProfileCard({ profile, saved, onToggleSave, onInvite, onViewDetails }) {
  return (
    <article className="rounded-2xl shadow-sm border border-slate-200/60 bg-white p-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          {/* UserPost: name -> username */}
          <h3 className="text-xl font-semibold tracking-tight">{profile.username}</h3>
          {/* UserPost: role -> workStyle */}
          <p className="text-slate-500 text-sm mt-0.5">{profile.workStyle}</p>
          {/* UserPost: note -> intro */}
          {profile.intro && <p className="text-slate-600 text-sm mt-2 line-clamp-1">{profile.intro}</p>}
        </div>
        <button
          className={`p-2 rounded-full border ${saved ? "border-teal-200 bg-teal-50 text-teal-600" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
          onClick={() => onToggleSave(profile.id)}
          aria-label={saved ? "저장 취소" : "저장"}
          title={saved ? "저장 취소" : "저장"}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d={saved ? "M7 3h10a2 2 0 0 1 2 2v16l-7-3-7 3V5a2 2 0 0 1 2-2z" : "M7 3h10a2 2 0 0 1 2 2v16l-7-3-7 3V5a2 2 0 0 1 2-2zm0 2v12.764l5-2.143 5 2.143V5H7z"}
            />
          </svg>
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        {/* skills 필드는 이름이 동일 */}
        {profile.skills?.map((s) => (
          <span key={s} className="rounded-full px-3 py-1 text-sm border border-slate-200 text-slate-700">
            {s} 
          </span>
        ))}
      </div>

      <div className="flex items-center justify-end mt-4">
        {/* location과 university 정보는 삭제하고 협업 기간으로 대체 */}
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <span>협업 기간: {profile.collaborationPeriod}</span>
        </div>

        {/* 매치율 (matchScore) 관련 로직 모두 삭제됨 */}
      </div>

      <footer className="flex items-center justify-end gap-2 mt-5">
        <button 
          onClick={() => onViewDetails(profile)} 
          className="rounded-full px-4 py-2 border border-slate-300 hover:bg-slate-50 text-sm font-medium"
        >
          자세히
        </button>
        <button 
          className="rounded-full px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 text-sm font-medium" 
          onClick={() => onInvite(profile.id)}
        >
          영입 제안
        </button>
      </footer>
    </article>
  );
}