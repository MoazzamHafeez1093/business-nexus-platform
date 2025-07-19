import React from "react";

export default function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  disabled = false,
  animation = true,
  ...props
}) {
  const base =
    "relative overflow-hidden font-semibold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 active:scale-95 flex items-center justify-center gap-2 transform hover:scale-105 hover:shadow-xl";
  
  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-lg hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 focus:ring-indigo-400 hover:shadow-2xl",
    secondary:
      "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:from-emerald-600 hover:to-teal-600 focus:ring-emerald-400 hover:shadow-2xl",
    ghost:
      "bg-transparent text-indigo-600 border-2 border-indigo-300 hover:bg-indigo-50 hover:border-indigo-400 focus:ring-indigo-200 hover:shadow-lg",
    danger:
      "bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-white shadow-lg hover:from-red-600 hover:via-pink-600 hover:to-rose-600 focus:ring-red-400 hover:shadow-2xl",
    success:
      "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:from-green-600 hover:to-emerald-600 focus:ring-green-400 hover:shadow-2xl",
    warning:
      "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg hover:from-yellow-600 hover:to-orange-600 focus:ring-yellow-400 hover:shadow-2xl",
    dark:
      "bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg hover:from-gray-800 hover:to-gray-900 focus:ring-gray-400 hover:shadow-2xl",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  const animationClasses = animation ? "hover:scale-105 hover:shadow-2xl active:scale-95" : "";

  return (
    <button
      className={`
        ${base} 
        ${variants[variant] || variants.primary} 
        ${sizes[size]} 
        ${animationClasses}
        ${loading ? "opacity-80 cursor-not-allowed" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>Loading...</span>
        </span>
      ) : (
        <>
          {icon && <span className="flex items-center">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
