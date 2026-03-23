import React from 'react';

const OurGroup = () => {
  const departments = [
    { title: "Technical Engineering", count: "14 Students", color: "bg-[#FF007F10] text-[#FF007F] border-[#FF007F30]" },
    { title: "Digital Design", count: "08 Students", color: "bg-white/5 text-white border-white/10" },
    { title: "Advanced Modules", count: "21 Students", color: "bg-zinc-900 text-zinc-500 border-white/5" },
    { title: "Strategic Operations", count: "06 Students", color: "bg-[#FF007F10] text-[#FF007F] border-[#FF007F30]" }
  ];

  return (
    <div className="bg-black py-40 px-8 relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-[#FF007F03] to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center mb-32 group">
             <div className="flex items-center gap-8 mb-8 justify-center">
                 <span className="w-10 h-1 bg-white opacity-10"></span>
                 <span className="text-[#FF007F] font-bold uppercase tracking-[0.8em] text-[10px] italic">Premium Education</span>
                 <span className="w-10 h-1 bg-white opacity-10"></span>
             </div>
             <h2 className="text-6xl md:text-9xl font-extrabold text-white font-heading tracking-tighter italic uppercase underline decoration-[#FF007F] decoration-8 underline-offset-[20px] mb-12">Our <span className="text-zinc-800">Courses.</span></h2>
             <p className="text-zinc-600 font-bold uppercase tracking-[0.4em] text-[11px] max-w-2xl mx-auto italic leading-relaxed">Join specialized departments for advanced technical training and job-ready skills.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 w-full">
          {departments.map((dept, i) => (
            <div key={i} className={`p-12 rounded-[3rem] flex flex-col items-center text-center justify-center transition-all duration-700 hover:scale-105 border-2 ${dept.color} shadow-2xl relative overflow-hidden group`}>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#FF007F05] rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="w-3 h-3 bg-white/10 rounded-full mb-8 group-hover:bg-[#FF007F] group-hover:shadow-[0_0_10px_#FF007F] transition-all"></div>
               <h3 className="text-2xl font-extrabold mb-4 uppercase tracking-tighter italic text-white group-hover:text-[#FF007F] transition-colors">{dept.title}</h3>
               <span className="px-5 py-2 bg-black border border-white/10 rounded-full text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-500 italic group-hover:text-white transition-colors">{dept.count}</span>
            </div>
          ))}
        </div>

        {/* Simple Stats Display */}
        <div className="mt-32 w-full max-w-5xl bg-[#0A0A0A] border border-white/5 p-16 rounded-[4rem] text-center shadow-2xl hover:border-[#FF007F]/20 transition-all group">
            <h4 className="text-[#FF007F] text-4xl m-0 font-extrabold italic uppercase tracking-tighter mb-10 group-hover:scale-105 transition-transform">Better <span className="text-white">Future.</span></h4>
            <div className="flex flex-wrap justify-center gap-12 px-10 border-t border-white/5 pt-12">
               <span className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.5em] italic hover:text-white cursor-help">RELIABLE</span>
               <span className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.5em] italic hover:text-white cursor-help">MODERN</span>
               <span className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.5em] italic hover:text-white cursor-help">SECURE</span>
               <span className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.5em] italic hover:text-white cursor-help">ADVANCED</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OurGroup;
