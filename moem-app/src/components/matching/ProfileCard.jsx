import React from 'react'

export default function ProfileCard({ profile, saved, onToggleSave, onInvite }) {
    return (
        <article className="rounded-2xl shadow-sm border border-slate-200/60 bg-white p-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">{profile.name}</h3>
          <p className="text-slate-500 text-sm mt-0.5">{profile.role}</p>
          {profile.note && <p className="text-slate-600 text-sm mt-2 line-clamp-1">{profile.note}</p>}
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
        {profile.skills?.map((s) => (
          <span key={s.id} className="rounded-full px-3 py-1 text-sm border border-slate-200 text-slate-700">
            {s.label}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>
          </svg>
          <span>{profile.location ?? "-"}</span>
          {profile.university && <><span className="mx-1">·</span><span>{profile.university}</span></>}
        </div>

        {typeof profile.matchScore === "number" && (
          <div className="w-40">
            <div className="flex items-center justify-between mb-1 text-sm">
              <div className="flex items-center gap-1 text-slate-600">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l2.39 4.85L20 7.27l-3.9 3.8L17.3 18 12 15.27 6.7 18l1.2-6.93L4 7.27l5.61-.42L12 2z"/></svg>
                <span>매치율</span>
              </div>
              <span className="font-medium">{profile.matchScore}%</span>
            </div>
            <div className="h-2 w-full rounded bg-slate-200 overflow-hidden">
              <div className="h-full bg-teal-500" style={{ width: `${profile.matchScore}%` }} />
            </div>
          </div>
        )}
      </div>

      <footer className="flex items-center justify-end gap-2 mt-5">
        <button className="rounded-full px-4 py-2 border border-slate-300 hover:bg-slate-50">
          자세히
        </button>
        <button className="rounded-full px-4 py-2 bg-teal-600 text-white hover:bg-teal-700" onClick={() => onInvite(profile.id)}>
          영입 제안
        </button>
      </footer>
    </article>
  );
}