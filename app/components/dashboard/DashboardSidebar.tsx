'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from "@clerk/nextjs";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  
  const isAdmin = user?.publicMetadata?.role === 'admin';

  const commonLinks = [
    { name: 'My Dashboard', href: '/dashboard', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011-1v4a1 1 0 001-1m-6 0h6" /></svg>
    )},
    { name: 'My Exams', href: '/exams', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { name: 'My Results', href: '/results', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    )},
  ];

  const adminLinks = [
    { name: 'Admin Hub', href: '/admin', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
    )},
    { name: 'Manage Exams', href: '/admin/exams', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    )},
  ];

  const NavItem = ({ link }: { link: any }) => {
    const isActive = pathname === link.href;
    return (
      <Link 
        href={link.href}
        onClick={() => setIsOpen(false)}
        className={`flex items-center gap-5 px-8 py-5 rounded-[1.5rem] transition-all duration-300 group relative
          ${isActive 
            ? 'bg-[#FF007F] text-white shadow-[0_0_30px_-5px_#FF007F]' 
            : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5'}`}
      >
        <span className={`transition-transform group-hover:rotate-6 ${isActive ? 'text-white' : 'text-zinc-600 group-hover:text-[#FF007F]'}`}>
          {link.icon}
        </span>
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] italic truncate">
          {link.name}
        </span>
        {isActive && (
          <div className="absolute right-6 w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Header (Hidden on LG) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-xl z-[120] px-8 flex items-center justify-between border-b border-white/5 shadow-2xl">
         <div className="flex items-center gap-4">
             <div className="w-8 h-8 bg-[#FF007F] text-white flex items-center justify-center font-bold text-lg rounded-xl rotate-12 italic shadow-[0_0_15px_#FF007F]">V</div>
             <span className="text-white text-[11px] font-bold uppercase tracking-[0.2em] italic leading-none">VCI Institute</span>
         </div>
         <button 
           onClick={() => setIsOpen(!isOpen)}
           className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white active:scale-95 hover:bg-[#FF007F] hover:border-[#FF007F] transition-all"
         >
           {isOpen ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
           ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
           )}
         </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[125] lg:hidden animate-in fade-in duration-500"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Main Sidebar (Mobile Only) */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 sm:w-80 bg-black z-[130] transform transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] border-r border-white/5 lg:hidden
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none'}
      `}>
          <div className="flex flex-col h-full p-8">
              {/* Branding */}
              <div className="mb-14 flex items-center gap-5 px-2">
                   <div className="w-12 h-12 bg-[#FF007F] text-white flex items-center justify-center font-bold text-2xl rounded-2xl rotate-12 italic shadow-[0_0_25px_#FF007F]">V</div>
                   <div className="flex flex-col">
                       <span className="text-white text-xl font-bold font-heading italic tracking-tight leading-none">VCI Portal</span>
                       <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.3em] mt-2 italic">Dashboard Area</span>
                   </div>
              </div>

              {/* Navigation Sections */}
              <div className="flex-1 space-y-10 overflow-y-auto custom-scrollbar">
                  <div>
                      <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-[0.3em] mb-6 px-4 italic leading-none">Main Menu</p>
                      <nav className="space-y-3">
                          {commonLinks.map((link) => (
                              <NavItem key={link.name} link={link} />
                          ))}
                      </nav>
                  </div>

                  {isAdmin && (
                    <div className="pt-4">
                        <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-[0.3em] mb-6 px-4 italic leading-none">Admin Menu</p>
                        <nav className="space-y-3">
                            {adminLinks.map((link) => (
                                <NavItem key={link.name} link={link} />
                            ))}
                        </nav>
                    </div>
                  )}
              </div>

              {/* User Profile */}
              <div className="mt-auto pt-8 border-t border-white/5">
                   <div className="p-6 bg-white/5 border border-white/5 rounded-[2.5rem] flex items-center justify-between hover:border-[#FF007F]/30 transition-all cursor-pointer group">
                       <div className="flex items-center gap-4">
                           {isLoaded && <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-10 h-10 border border-white/10 group-hover:border-[#FF007F]' } }} />}
                           <div className="flex flex-col overflow-hidden max-w-[120px]">
                               <span className="text-[11px] font-bold text-white truncate font-heading italic">{user?.firstName || 'Operator'}</span>
                               <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest truncate mt-0.5 italic leading-none">{isAdmin ? 'ADMIN' : 'STUDENT'}</span>
                           </div>
                       </div>
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-800 group-hover:text-[#FF007F] transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7m0 0l-7 7m7-7H3" /></svg>
                   </div>
              </div>
          </div>
      </aside>
    </>
  );
}
