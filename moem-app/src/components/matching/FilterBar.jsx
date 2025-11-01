import React from "react";

const COMMON_SKILLS = [
  { id: "react", label: "React" },
  { id: "ts", label: "TypeScript" },
  { id: "spring", label: "Spring" },
  { id: "mysql", label: "MySQL" },
  { id: "figma", label: "Figma" },
];

export default function FilterBar({ selected, onToggle, onOpenAdvanced }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {COMMON_SKILLS.map((s) => {
        const active = selected.includes(s.id);
        return (
          <button
            key={s.id}
            onClick={() => onToggle(s.id)}
            className={[
              "px-3 py-1.5 rounded-full border text-sm",
              active ? "bg-teal-50 text-teal-700 border-teal-200" : "border-slate-200 text-slate-600 hover:bg-slate-50",
            ].join(" ")}
          >
            {s.label}
          </button>
        );
      })}

      <button className="px-3 py-1.5 rounded-full text-sm text-slate-700 hover:bg-slate-50"
              onClick={onOpenAdvanced}>
        <span className="inline-flex items-center gap-1">
          <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M3 5h18v2H3V5zm4 6h10v2H7v-2zm-2 6h14v2H5v-2z"/></svg>
          고급 필터
        </span>
      </button>
    </div>
  );
}
