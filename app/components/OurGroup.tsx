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
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "Rahul Singh",
    detail:
      "Senior Faculty – Computer Applications (Web Development & MERN Stack)",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 4,
    name: "Neha Gupta",
    detail:
      "Head of Admissions & Career Counseling (Student Placement Strategy)",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 5,
    name: "Saurabh Mishra",
    detail: "Accounts Manager (Financial Planning & Institutional Audits)",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 6,
    name: "Pooja Yadav",
    detail: "Graphic Design Lead (Brand Identity & Digital Media)",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 7,
    name: "Ankit Patel",
    detail: "IT Infrastructure Manager (Systems, Networks & Security)",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 8,
    name: "Kavita Verma",
    detail: "Administration Head (Operations, Compliance & Staff Management)",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
];

const OurGroup = () => {
  return (
    <div className="min-h-screen bg-primary px-6 py-12">
      <h3 className="text-3xl font-bold text-center mb-10">Our Group</h3>

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
  );
};

export default OurGroup;
