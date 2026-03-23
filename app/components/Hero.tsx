import React from "react";

const Hero = () => {
  return (
    <div className="relative min-h-[90dvh] flex items-center bg-black overflow-hidden py-24 px-8 border-b border-[#FF007F05]">
      {/* Switzerland Industrial Lines - Cyber Version */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
          <div className="absolute top-0 left-[12.5%] w-px h-full bg-white"></div>
          <div className="absolute top-0 left-[37.5%] w-px h-full bg-white"></div>
          <div className="absolute top-0 left-[62.5%] w-px h-full bg-white"></div>
          <div className="absolute top-0 left-[87.5%] w-px h-full bg-white"></div>
          <div className="absolute top-[25%] left-0 w-full h-px bg-white"></div>
          <div className="absolute top-[75%] left-0 w-full h-px bg-white"></div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#FF007F05] to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto w-full relative z-10 sm:px-10 lg:px-16">
        <div className="flex flex-col items-start text-left">
            {/* Simple Status Indicator */}
           <div className="inline-flex items-center gap-4 mb-10 px-6 py-3 bg-[#0A0A0A] border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.3em] animate-fade-in shadow-xl italic">
              <span className="flex h-2 w-2 bg-[#FF007F] animate-pulse shadow-[0_0_10px_#FF007F]"></span>
              VCI Institute: Online
          </div>

          <h1 className="text-7xl md:text-9xl font-extrabold text-white mb-10 tracking-tighter leading-[0.9] font-heading animate-slide-up italic">
            Better <br />
            <span className="text-[#FF007F] text-glow">Learning.</span>
          </h1>
          
          <div className="max-w-xl ml-1 p-8 border-l-4 border-[#FF007F] animate-fade-in delay-200 bg-white/5 backdrop-blur-sm rounded-r-2xl">
             <p className="text-lg md:text-xl text-zinc-400 leading-relaxed font-bold mb-10 uppercase tracking-wide italic">
                Join the premier institute for advanced computer education. 
                VCI helps you build your career with modern digital excellence.
             </p>
             
             <div className="flex flex-col sm:flex-row gap-6 justify-start w-full sm:auto animate-slide-up delay-300">
                <button className="px-12 h-16 w-full sm:w-auto bg-[#FF007F] text-white text-[11px] font-bold uppercase tracking-[0.3em] rounded-xl hover:bg-white hover:text-black transition-all duration-500 shadow-[0_0_30px_-5px_#FF007F] active:scale-95 italic">
                  ENROLL NOW 
                </button>
                <button className="px-12 h-16 w-full sm:w-auto bg-white/5 border border-white/10 text-white text-[11px] font-bold uppercase tracking-[0.3em] rounded-xl hover:bg-white hover:text-black transition-all shadow-2xl active:scale-95 italic">
                  OUR COURSES
                </button>
             </div>
          </div>

          {/* Trust Indicators: Simple */}
          <div className="mt-20 pt-10 border-t border-white/5 flex flex-wrap justify-start gap-12 opacity-50 hover:opacity-100 transition-all duration-700">
              <div className="flex flex-col items-start">
                  <span className="text-sm font-bold text-white tracking-widest uppercase italic">ISO 9001:2015</span>
                  <span className="text-[10px] text-[#FF007F] font-bold uppercase tracking-[0.4em] mt-1 italic animate-pulse">Global Standard</span>
              </div>
              <div className="flex flex-col items-start">
                  <span className="text-sm font-bold text-white tracking-widest uppercase italic">GOVT REG.</span>
                  <span className="text-[10px] text-[#FF007F] font-bold uppercase tracking-[0.4em] mt-1 italic animate-pulse">Govt. Approved</span>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;