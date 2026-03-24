"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar } from "../components/shared";
import { UPCOMING_LEAVES } from "./mock";

export function LeaveCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 200 : -200, behavior: "smooth" });
  };

  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-[13px] font-bold text-slate-800 tracking-[-0.01em]">
          Upcoming Time Off
        </h3>
        <div className="flex gap-1.5">
          <button
            onClick={() => scroll("left")}
            className="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ChevronLeft size={13} className="text-slate-500" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ChevronRight size={13} className="text-slate-500" />
          </button>
        </div>
      </div>

      {/* scrollable cards */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {UPCOMING_LEAVES.map((leave) => (
          <div
            key={leave.id}
            className="flex-shrink-0 w-36 rounded-2xl p-4 flex flex-col gap-2.5 border"
          >
            {/* top row */}
            <div className="flex items-center justify-between">
              <Avatar initials={leave.initials} size="sm" />
              <span className="text-lg leading-none">{leave.icon}</span>
            </div>

            {/* info */}
            <div>
              <p className="text-[11px] font-bold text-slate-800 leading-tight">
                {leave.name.split(" ")[0]}
              </p>
              <p
                className="text-[10px] font-semibold mt-0.5"
              >
                {leave.type}
              </p>
            </div>

            {/* date range pill */}
            <div className="mt-auto bg-white rounded-lg px-2 py-1.5">
              <p className="text-[9px] text-slate-400 leading-none">
                {leave.from} → {leave.to}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
