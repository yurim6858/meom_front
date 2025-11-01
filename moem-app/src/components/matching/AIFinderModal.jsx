import React from "react";

const AIFinderModal = ({ open, progress, label, onCancel }) => {
  return (
    <div
      className={`fixed inset-0 z-[120] ${open ? "" : "hidden"} flex items-center justify-center`}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-700">🤖</span>
          <h3 className="text-base font-semibold text-gray-800">{label.aiName}</h3>
        </div>
        <p className="text-sm text-gray-700">
          <b>{label.userName}</b>님께 딱 맞는 팀원을 찾아다니고 있어요…
        </p>
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
            <span>매칭 분석</span>
            <span className="tabular-nums">{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div className="h-full bg-teal-500 transition-[width] duration-150" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button className="text-xs text-gray-500 underline underline-offset-2" onClick={onCancel}>
            바로 보기
          </button>
          <span className="text-xs text-gray-400">진행 중에도 취소 가능</span>
        </div>
      </div>
    </div>
  );
};

export default AIFinderModal;