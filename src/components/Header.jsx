import React from "react";

export default function Header() {
  return (
    <div className="my-8 flex items-center justify-between mx-5 max-w-6xl sm:mx-auto">
      <a href="/" className="text-2xl">
        <span className="rounded-lg bg-amber-500 px-3 py-1 font-bold text-[#4C205B]">EOSI</span>
        <span className="font-semibold text-violet-900 text-2xl"> Finance</span>
      </a>

      <nav className="hidden md:flex items-center gap-6 text-sm text-gray-200">
        <a href="/">Home</a>
        <a href="#roadmap">Roadmap</a>
        <a href="#team">Team</a>
        <a href="https://medium.com/@eosifinance_ai" target="_blank" rel="noopener noreferrer">
          Blog
        </a>
      </nav>
    </div>
  );
}
