import React from "react";

export default function AuthCard({ children, graphic, tagline }) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white/90 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-fade-in">
      {/* Left: Brand/graphic */}
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-500 to-blue-500 text-white p-10 w-1/2 relative">
        <div className="mb-8">
          <div className="text-3xl font-extrabold font-poppins tracking-tight">Business Nexus</div>
          <div className="mt-2 text-lg font-inter opacity-90">{tagline || "Connecting Investors and Entrepreneurs"}</div>
        </div>
        <div className="w-48 h-48 flex items-center justify-center">
          {graphic || (
            <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="80" cy="80" r="75" fill="#818CF8" fillOpacity="0.2" />
              <rect x="40" y="60" width="80" height="40" rx="20" fill="#6366F1" />
              <circle cx="80" cy="80" r="30" fill="#A5B4FC" />
            </svg>
          )}
        </div>
      </div>
      {/* Right: Form/children */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-12 bg-white">
        {children}
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out; }
      `}</style>
    </div>
  );
} 