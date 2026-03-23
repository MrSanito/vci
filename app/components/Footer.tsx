'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();
    const currentYear = new Date().getFullYear();
    
    // Hide footer ONLY on mobile for dashboard and admin pages
    const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');
    const hideOnMobile = isDashboard;

    const footerLinks = [
        { name: "Help Center", href: "#" },
        { name: "Online Status", href: "#" },
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
    ];

  return (
    <footer className={`footer footer-center p-20 bg-black text-white relative overflow-hidden border-t border-white/5 ${hideOnMobile ? "lg:flex hidden" : "flex"}`}>
        {/* Abstract Cyber Background - Faded */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF007F10] to-transparent shadow-[0_0_20px_#FF007F10]"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#FF007F] rounded-full blur-[120px] opacity-[0.03]"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FF007F] rounded-full blur-[120px] opacity-[0.03]"></div>

        <div className="max-w-7xl mx-auto flex flex-col items-center gap-12 relative z-10">
            {/* Simple Brand Logo */}
            <div className="flex flex-col items-center gap-5">
                <div className="w-14 h-14 bg-[#FF007F] text-white flex items-center justify-center font-bold text-2xl rounded-2xl rotate-12 shadow-[0_0_20px_-5px_#FF007F] italic animate-pulse">V</div>
                <div className="flex flex-col items-center">
                    <span className="text-xl font-bold font-heading italic tracking-tighter text-white">VCI Institute</span>
                    <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.3em] mt-2 italic">Online Exam Platform</span>
                </div>
            </div>

            {/* Simple Links */}
            <nav className="flex flex-wrap justify-center gap-10">
                {footerLinks.map((link) => (
                    <Link 
                        key={link.name} 
                        href={link.href} 
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-[#FF007F] transition-all italic"
                    >
                        {link.name}
                    </Link>
                ))}
            </nav>

            {/* Bottom Meta */}
            <div className="flex flex-col items-center gap-6 border-t border-white/5 pt-10 w-full">
                <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-[0.2em] italic">
                    © {currentYear} VCI Institute • Quality Education
                </p>
                <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 bg-[#FF007F] rounded-full shadow-[0_0_10px_#FF007F]"></div>
                    <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full"></div>
                </div>
            </div>
        </div>
    </footer>
  );
}
