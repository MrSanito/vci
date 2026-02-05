import React from "react";

const OurGroupCard = ({ name, detail, avatar }) => {
  return (
    <div className="card bg-base-300/45 w-64 shadow-sm">
      <figure className="px-10 pt-10">
        <img
          src={avatar}
          alt={name}
          className="w-24 h-24 mx-auto rounded-full object-cover mb-4 border-4 border-gray-200"
        />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{name}</h2>
        <p>{detail} </p>
      </div>
    </div>
  );
};

export default OurGroupCard;
