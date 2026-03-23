import React from "react";

interface OurGroupCardProps {
  name: string;
  detail: string;
  avatar: string;
}

const OurGroupCard = ({ name, detail, avatar }: OurGroupCardProps) => {
  return (
    <div className="relative flex flex-col items-start bg-white border border-slate-200 group/card transition-all duration-300 hover:bg-slate-900 cursor-pointer p-0 overflow-hidden">
      {/* Avatar Partition: Subtle Grayscale */}
      <div className="relative w-full aspect-square bg-slate-100 overflow-hidden border-b border-slate-200">
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover grayscale opacity-70 group-hover/card:grayscale-0 group-hover/card:opacity-100 transition-all duration-500 group-hover/card:scale-110"
          />
          <div className="absolute top-4 right-4 w-10 h-10 bg-rose-600 text-white flex items-center justify-center font-semibold text-[10px] shadow-lg opacity-0 group-hover/card:opacity-100 transition-opacity">
              VCI
          </div>
      </div>

      {/* Identity Label: Normal Weights */}
      <div className="w-full p-6 flex flex-col items-start gap-4">
        <h3 className="text-xl font-semibold text-slate-900 font-heading tracking-tight group-hover/card:text-white transition-colors">
            {name}
        </h3>
        <span className="text-[10px] text-rose-600 font-semibold uppercase tracking-widest bg-rose-50 px-3 py-1.5 group-hover/card:bg-rose-600 group-hover/card:text-white transition-colors">
            Registry Active
        </span>
        <p className="text-xs text-slate-500 leading-relaxed font-normal group-hover/card:text-slate-400 transition-colors mt-1">
            {detail}
        </p>
      </div>
      
      {/* Decorative Index: Subtle */}
      <div className="absolute top-0 left-0 w-1 h-0 bg-rose-600 group-hover/card:h-full transition-all duration-500"></div>
    </div>
  );
};

export default OurGroupCard;
