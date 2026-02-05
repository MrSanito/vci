import React from 'react'

const Hero = () => {
  return (
    <div className="hero min-h-[95dvh] relative overflow-hidden flex items-center justify-center">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,_rgba(59,130,246,0.15),_transparent_40%),_radial-gradient(circle_at_80%_80%,_rgba(168,85,247,0.15),_transparent_40%)] pointer-events-none"></div>
      
      {/* Animated Orbs */}
      <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-blue-600/10 rounded-full blur-[100px] animate-float"></div>
      <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-bounce duration-[8000ms]"></div>
      
      <div className="hero-content text-center z-10 p-6">
        <div className="max-w-2xl">
           <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium tracking-wide">
              🚀 Empowering Future Tech Leaders
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-8 drop-shadow-2xl tracking-tight leading-tight">
            Master the Art of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-glow">
              Computing
            </span>
          </h1>
          
          <p className="py-6 text-xl text-slate-300 leading-relaxed max-w-xl mx-auto">
            Join the premier institute for advanced computer education. 
            From basics to professional development, we shape your digital future.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <button className="btn btn-lg bg-white text-slate-900 border-none hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105">
              Start Learning
            </button>
            <button className="btn btn-lg glass-panel text-white hover:bg-white/10 transition-all hover:scale-105">
              View Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero