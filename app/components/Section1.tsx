import React from "react";

const Section1 = () => {
  return (
    <div className="min-h-[50dvh] flex flex-col md:flex-row justify-center items-stretch gap-6 px-6 py-10">
      {/* LEFT BOX */}
      <div className="border border-white w-full md:w-1/3 p-6 rounded-xl bg-white/5 backdrop-blur">
        <h3 className="text-xl font-bold mb-4">
          🎓 Free Online Full Video Lectures
        </h3>
        <ul className="space-y-2 text-sm">
          <li>Tally.ERP9 Full Course With PDF Notes</li>
          <li>MS-Excel Full Video Lecture</li>
          <li>MS-Word Full Video Lecture</li>
          <li>MS-PowerPoint Full Video Lecture</li>
          <li>Adobe Photoshop Full Video Lecture</li>
          <li>CorelDRAW Full Video Lecture</li>
          <li>Adobe Illustrator Full Video Lecture</li>
        </ul>
      </div>

      {/* RIGHT BOX */}
      <div className="border border-white w-full md:w-1/3 p-6 rounded-xl bg-white/5 backdrop-blur">
        <h3 className="text-xl font-bold mb-4">
          📚 Free Online Computer Courses + Notes
        </h3>
        <ul className="space-y-2 text-sm">
          <li>Tally.ERP9 Full Course With PDF Notes</li>
          <li>CCC Full PDF Notes</li>
          <li>ADCA Full Course With PDF Notes</li>
          <li>O-Level Full Course With PDF Notes</li>
          <li>Adobe Photoshop Full Course</li>
          <li>CorelDRAW Full Course</li>
        </ul>
      </div>
    </div>
  );
};

export default Section1;
