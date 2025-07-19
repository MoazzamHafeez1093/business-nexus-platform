import React from 'react';

export default function TestVibrant() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <div className="force-tailwind-gradients min-h-screen w-full flex flex-col items-center justify-center">
        <button className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition-all text-2xl font-bold">
          Vibrant Button
        </button>
        <button className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition-all text-2xl font-bold mt-8">
          Green-Blue Gradient Button
        </button>
      </div>
    </div>
  );
} 