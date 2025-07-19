import React from "react";

export default function Toast({ message, type = "success", onClose }) {
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg font-poppins text-lg flex items-center gap-3 animate-toast-in ${type === "success" ? "bg-green-100 text-green-700 border border-green-300" : "bg-red-100 text-red-700 border border-red-300"}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-xl font-bold text-gray-400 hover:text-gray-600 focus:outline-none">&times;</button>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(-30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-toast-in { animation: toast-in 0.5s cubic-bezier(.4,2,.6,1) both; }
      `}</style>
    </div>
  );
} 