import React from "react";

interface OurGroupCardProps {
  name: string;
  detail: string;
  avatar: string;
}

const OurGroupCard = ({ name, detail, avatar }: OurGroupCardProps) => {
  return (
    <div className="glass-panel rounded-2xl p-6 text-center shadow-lg glass-panel-hover group relative overflow-hidden">
        {/* Hover Highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* Avatar */}
      <div className="flex justify-center mb-5">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
          <img
            src={avatar}
            alt={name}
            className="w-24 h-24 rounded-full object-cover border-2 border-white/10 shadow-xl relative z-10 group-hover:border-white/30 transition-colors"
          />
        </div>
      </div>

      {/* Text */}
      <div className="relative z-10">
        <h2 className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors">{name}</h2>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">{detail}</p>
      </div>
    </div>
  );
};

export default OurGroupCard;
