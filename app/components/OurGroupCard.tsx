import React from "react";

const OurGroupCard = ({ name, detail, avatar }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-5 text-center shadow-lg hover:scale-105 transition duration-300">
      {/* Avatar */}
      <div className="flex justify-center">
        <img
          src={avatar}
          alt={name}
          className="w-20 h-20 rounded-full object-cover border-2 border-blue-400 shadow-md"
        />
      </div>

      {/* Text */}
      <div className="mt-4">
        <h2 className="font-semibold text-sm text-white">{name}</h2>
        <p className="text-xs text-gray-300 mt-1 leading-snug">{detail}</p>
      </div>
    </div>
  );
};

export default OurGroupCard;
