import React from "react";
import { getChannelVideos } from "../lib/youtube";

const Section1 = async () => {
    // 1. Fetch Videos (Dynamic)
    const videos = await getChannelVideos(6);

    const notesCourses = [
        { title: "MS Word Full Course", query: "Ms Word" },
        { title: "Computer Fundamentals", query: "Computer Fundamentals" },
        { title: "CCC & O-Level Series", query: "CCC O level" },
        { title: "Networking & Internet", query: "Networking IP Address" },
        { title: "Computer Hardware", query: "Hardware Of Computer" },
        { title: "HTML & Web Design", query: "HTML language" }
    ];

  return (
    <section className="py-24 px-6 relative">
         {/* Background Elements */}
       <div className="absolute top-10 right-10 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] -z-10"></div>
       <div className="absolute bottom-10 left-10 w-64 h-64 bg-purple-600/5 rounded-full blur-[80px] -z-10"></div>

      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-white drop-shadow-md">
            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Resources</span>
        </h2>

        <div className="bentogrid-wrapper">
            {/* Card 1: Video Lectues (Now Dynamic) */}
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </span>
                    Latest Video Lectures
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {videos.map((video) => (
                         <a 
                            key={video.id} 
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-blue-600/20 hover:border-blue-500/30 transition-all group/item"
                        >
                            {/* Thumbnail (using generic placeholder if mock, or real if API) */}
                            {video.thumbnail && (
                                <img src={video.thumbnail} alt={video.title} className="w-12 h-12 rounded-lg object-cover bg-slate-900" />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-200 font-medium truncate group-hover/item:text-blue-300 transition-colors">
                                    {video.title}
                                </p>
                                <p className="text-xs text-slate-500">Watch Now</p>
                            </div>
                        </a>
                    ))}
                </div>
                <div className="mt-8">
                     <a href="https://www.youtube.com/@LEARNVCI" target="_blank" className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Subscribe & Watch All &rarr;
                    </a>
                </div>
            </div>

            {/* Card 2: Notes & Courses (Dynamic Links) */}
             <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-purple-500/30 transition-all duration-500 md:col-span-1 lg:col-span-2">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-purple-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg>
                </div>

                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                     <span className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    </span>
                    Computer Courses & Notes
                </h3>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {notesCourses.map((item, idx) => (
                        <a 
                            key={idx} 
                            href={`https://www.youtube.com/@LEARNVCI/search?query=${encodeURIComponent(item.query)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-white/5 hover:bg-purple-600/10 hover:border-purple-500/30 transition-all cursor-pointer"
                        >
                             <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                             <span className="text-slate-300 text-sm group-hover:text-purple-300 transition-colors">{item.title}</span>
                        </a>
                    ))}
                </div>
                 <div className="mt-8">
                     <button className="text-sm font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Download PDFs &rarr;
                    </button>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Section1;
