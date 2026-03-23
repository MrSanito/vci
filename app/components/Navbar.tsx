'use client'

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide the global navbar ONLY on mobile for dashboard and admin areas (Sidebar handles mobile)
  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

  const baseLinks = [
    { name: "Home", href: "/" },
    { name: "Exams", href: "/exams" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[110] transition-all duration-500 ${
        scrolled ? "bg-black/95 backdrop-blur-xl border-b border-[#FF007F10] py-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]" : "bg-black/80 backdrop-blur-md py-6"
      } ${isDashboard ? "lg:flex hidden" : "flex"}`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between w-full">
        {/* Brand: Simple & Clean */}
        <Link href="/" className="flex items-center gap-4 group cursor-pointer active:scale-95 transition-all">
          <div className="w-10 h-10 bg-[#FF007F] text-white flex items-center justify-center font-bold text-xl rounded-xl transition-transform shadow-[0_0_20px_-5px_#FF007F]">V</div>
          <div className="flex flex-col">
            <span className="text-white text-lg font-bold font-heading tracking-tight leading-none group-hover:text-[#FF007F] transition-colors">VCI Institute</span>
            <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em] mt-1 group-hover:text-white transition-colors">Computer Education</span>
          </div>
        </Link>

        {/* Navigation */}
        <div className="hidden lg:flex items-center gap-10 ml-20">
          {baseLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative group ${
                pathname === link.href ? "text-[#FF007F]" : "text-zinc-400 hover:text-white"
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-2 left-0 h-0.5 bg-[#FF007F] transition-all duration-300 ${pathname === link.href ? "w-full shadow-[0_0_10px_#FF007F]" : "w-0 group-hover:w-full"}`}></span>
            </Link>
          ))}
          {isAdmin && (
              <>
                 <Link href="/dashboard" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF007F] hover:text-white transition-all underline decoration-[#FF007F]/20 decoration-2 underline-offset-8">Student Dashboard</Link>
                 <Link href="/admin" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF007F] hover:text-white transition-all underline decoration-[#FF007F]/20 decoration-2 underline-offset-8">Admin Dashboard</Link>
              </>
          )}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-8 pl-10 border-l border-[#FF007F10] ml-auto">
          {isLoaded ? (
            user ? (
               <div className="flex items-center gap-4">
                   <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-[10px] text-white font-bold uppercase tracking-widest">{user.firstName}</span>
                        <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5 leading-none">{isAdmin ? 'Admin Area' : 'Student'}</span>
                   </div>
                   <UserButton afterSignOutUrl="/login" appearance={{ elements: { userButtonAvatarBox: 'w-10 h-10 border-2 border-white/10 shadow-sm hover:border-[#FF007F] transition-all' } }} />
               </div>
            ) : (
                <div className="flex items-center gap-6">
                     <SignInButton mode="modal">
                        <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:text-[#FF007F] transition-colors">Login</button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                        <button className="px-8 h-12 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-[#FF007F] hover:text-white transition-all shadow-xl active:scale-95">Register</button>
                    </SignUpButton>
                </div>
            )
          ) : (
             <div className="w-10 h-10 rounded-xl bg-zinc-900 animate-pulse"></div>
          )}
        </div>
      </div>
    </nav>
  );
}
