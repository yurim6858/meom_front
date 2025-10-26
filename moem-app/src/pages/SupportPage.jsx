import React, { useState } from "react";

const SupportPage = () => {
   const [form, setForm] = useState({
  
    title: "",
    content: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [records, setRecords] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRecord = {
      ...form,
      date: new Date().toLocaleString(),
    };

    setRecords((prev) => [newRecord, ...prev]);
    setSubmitted(true);
    setForm((prev) => ({ ...prev, title: "", content: "" }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      {/* 폼 카드 */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          고객 문의 / 오류 신고
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          사이트 이용 중 불편사항이나 오류가 있다면 알려주세요.
        </p>

    

        <form onSubmit={handleSubmit} className="space-y-4">
          

          <div>
            <label className="block text-sm font-medium text-gray-700">
              제목
            </label>
            <input
              type="text"
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              placeholder="제목을 입력해주세요."
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              문의 내용
            </label>
            <textarea
              name="content"
              required
              rows="5"
              value={form.content}
              onChange={handleChange}
              placeholder="오류를 입력해주세요."
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-[#9966CC] hover:bg-[#8755B3] text-white font-semibold py-2 rounded-lg shadow"
          >
            문의 제출
          </button>
        </form>
      </div>

      {/* 제출 기록: 폼 밖, 페이지 아래 */}
      {records.length > 0 && (
        <div className="w-full max-w-2xl mt-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            제출 기록
          </h2>
          <ul className="space-y-4">
            {records.map((record, index) => (
              <li
                key={index}
                className="p-4 border rounded-md bg-gray-50 shadow-sm"
              >
                <div className="text-sm text-gray-500 mb-1">{record.date}</div>
                <div className="font-semibold">{record.title}</div>
                <div className="text-gray-700 mt-1">{record.content}</div>
           
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
)}
export default SupportPage;