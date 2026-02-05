import React from "react";
import OurGroupCard from "./OurGroupCard";

const employeeData = [
  {
    id: 1,
    name: "Aman Verma",
    detail:
      "Assistant Managing Director of UPCISS Lakhimpur Branch (Graphic Designing & Accounting Expert)",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Ritika Sharma",
    detail:
      "Assistant Managing Director of UPCISS Lakhimpur Branch (Academic Operations & Student Coordination)",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Rahul Singh",
    detail:
      "Senior Faculty – Computer Applications (Web Development & MERN Stack)",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
  },
  {
    id: 4,
    name: "Neha Gupta",
    detail:
      "Head of Admissions & Career Counseling (Student Placement Strategy)",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 5,
    name: "Saurabh Mishra",
    detail: "Accounts Manager (Financial Planning & Institutional Audits)",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    id: 6,
    name: "Pooja Yadav",
    detail: "Graphic Design Lead (Brand Identity & Digital Media)",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
  },
  {
    id: 7,
    name: "Ankit Patel",
    detail: "IT Infrastructure Manager (Systems, Networks & Security)",
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
  },
  {
    id: 8,
    name: "Kavita Verma",
    detail: "Administration Head (Operations, Compliance & Staff Management)",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  },
];

const OurGroup = () => {
  return (
    <div className="min-h-screen py-24 px-6 relative">
      {/* Subtle Grid Background from CSS? Or just clean dark */}
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
             <span className="text-blue-400 text-sm font-bold tracking-widest uppercase mb-2 block">Our Team</span>
            <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-xl">
                Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-glow">Visionaries</span>
            </h3>
        </div>

        {/* 2 cols on phone → 4 rows of 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {employeeData.map((employee) => (
            <OurGroupCard
                key={employee.id}
                name={employee.name}
                detail={employee.detail}
                avatar={employee.avatar}
            />
            ))}
        </div>
      </div>
    </div>
  );
};

export default OurGroup;
