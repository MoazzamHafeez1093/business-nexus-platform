import React, { useState } from "react";

export default function InputField({ label, type = "text", icon, ...props }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="mb-4 w-full">
      {label && <label className="block mb-1 font-medium text-gray-700 font-inter">{label}</label>}
      <div className="relative">
        <input
          type={isPassword ? (show ? "text" : "password") : type}
          className="w-full p-3 border-2 border-indigo-200 rounded-lg font-inter text-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition pr-12"
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-600 focus:outline-none"
            onClick={() => setShow((s) => !s)}
          >
            {show ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.364-2.364A9.956 9.956 0 0022 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.636-1.364" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.121-2.121A9.956 9.956 0 0122 12c0 5.523-4.477 10-10 10S2 17.523 2 12c0-1.657.403-3.22 1.125-4.575" /></svg>
            )}
          </button>
        )}
        {icon && !isPassword && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400">{icon}</span>
        )}
      </div>
    </div>
  );
}
