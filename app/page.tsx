"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [hoveredProperty, setHoveredProperty] = useState(false);
  const [hoveredDatabase, setHoveredDatabase] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center flex-grow py-12">
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-4xl font-bold mb-6">Property AI Dashboard</h1>
        <p className="text-lg text-gray-600 mb-12">
          AI-powered property sales forecasting
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/property" 
            className={`px-6 py-3 rounded-md text-white font-bold text-lg transition-colors ${
              hoveredProperty ? "bg-teal-700" : "bg-teal-600"
            }`}
            onMouseEnter={() => setHoveredProperty(true)}
            onMouseLeave={() => setHoveredProperty(false)}
          >
            View Properties
          </Link>
          
          <Link 
            href="/database-analysis" 
            className={`px-6 py-3 rounded-md text-white font-bold text-lg transition-colors ${
              hoveredDatabase ? "bg-sky-700" : "bg-sky-500"
            }`}
            onMouseEnter={() => setHoveredDatabase(true)}
            onMouseLeave={() => setHoveredDatabase(false)}
          >
            Database Analysis
          </Link>
        </div>
      </div>
    </div>
  );
}