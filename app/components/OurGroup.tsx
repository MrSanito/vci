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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-14 text-white">
      <h3 className="text-3xl font-bold text-center mb-12 tracking-wide">
        Meet Our Team
      </h3>

      {/* 2 cols on phone → 4 rows of 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
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
  );
};

export default OurGroup;
