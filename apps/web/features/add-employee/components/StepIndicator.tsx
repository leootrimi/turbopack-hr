import { Check } from "lucide-react";
import { STEPS } from "./types";

interface Props {
  current: number; // 1-indexed
}

export function StepIndicator({ current }: Props) {
  return (
    <div className="w-full">
      <div className="flex items-start">
        {STEPS.map((step, idx) => {
          const done    = current > step.id;
          const active  = current === step.id;
          const isLast  = idx === STEPS.length - 1;

          return (
            <div key={step.id} className="flex items-start flex-1 min-w-0">
              {/* step node + connector */}
              <div className="flex flex-col items-center flex-1">
                {/* top row: circle + line */}
                <div className="flex items-center w-full">
                  {/* left line */}
                  {idx > 0 && (
                    <div className={`flex-1 h-0.5 transition-colors duration-300 ${done || active ? "bg-indigo-500" : "bg-slate-200"}`} />
                  )}

                  {/* circle */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-all duration-300 border-2 ${
                      done
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : active
                        ? "bg-white border-indigo-500 text-indigo-600 shadow-md shadow-indigo-100"
                        : "bg-white border-slate-200 text-slate-400"
                    }`}
                  >
                    {done ? <Check size={16} strokeWidth={2.5} /> : step.id}
                  </div>

                  {/* right line */}
                  {!isLast && (
                    <div className={`flex-1 h-0.5 transition-colors duration-300 ${done ? "bg-indigo-500" : "bg-slate-200"}`} />
                  )}
                </div>

                {/* labels */}
                <div className="text-center mt-2 px-1">
                  <p className={`text-xs font-bold transition-colors ${active ? "text-indigo-600" : done ? "text-slate-700" : "text-slate-400"}`}>
                    {step.title}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">{step.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
