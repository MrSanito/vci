import React from "react";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const Navbar = () => {
  return (
    <div className="drawer drawer-start z-50">
      {/* TOGGLE */}
      <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <div className="navbar glass-panel text-white px-6 sticky top-0 z-50 transition-all duration-300">
          {/* LEFT — INSTITUTE NAME */}
          <div className="navbar-start">
            <h3 className="text-xl font-extrabold whitespace-nowrap tracking-wide bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Vishal Computer Institute
            </h3>
          </div>

          {/* RIGHT */}
          <div className="navbar-end">
            {/* DESKTOP MENU */}
            <ul className="menu menu-horizontal px-1 gap-4 text-sm font-medium hidden lg:flex items-center">
              <li>
                <a href="/" className="hover:text-blue-400 transition-colors duration-300">Home</a>
              </li>
              <li>
                <a className="hover:text-blue-400 transition-colors duration-300">Notes</a>
              </li>
              <li>
                <a className="hover:text-blue-400 transition-colors duration-300">YouTube</a>
              </li>
              {/* Show Dashboard when logged in */}
              <SignedIn>
                <li>
                  <a href="/dashboard" className="text-blue-400 hover:text-blue-300 font-bold transition-colors duration-300">Dashboard</a>
                </li>
              </SignedIn>
              <li>
                <a className="hover:text-blue-400 transition-colors duration-300">About Us</a>
              </li>
              <li>
                <a href="/admin" className="btn btn-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none shadow-lg hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 ml-2">
                  Admin Login
                </a>
              </li>
              <li className="ml-2">
                  <SignedIn>
                      <UserButton />
                  </SignedIn>
                  <SignedOut>
                      <SignInButton mode="modal">
                          <button className="btn btn-sm btn-ghost text-white">Sign In</button>
                      </SignInButton>
                  </SignedOut>
              </li>
            </ul>
            
            {/* HAMBURGER — MOBILE ONLY */}
            <label
              htmlFor="mobile-drawer"
              className="btn btn-ghost btn-circle text-white lg:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
            </label>
          </div>
        </div>
      </div>

      {/* SIDEBAR (RIGHT SIDE ON MOBILE) */}
      <div className="drawer-side z-50">
        <label htmlFor="mobile-drawer" className="drawer-overlay backdrop-blur-sm"></label>

        <ul className="menu p-4 w-72 min-h-full bg-slate-900/95 backdrop-blur-xl text-white space-y-4 shadow-2xl border-r border-white/10">
          <li className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Menu</li>
          <li>
            <a className="hover:bg-white/10 hover:text-blue-400 rounded-lg">Home</a>
          </li>
          <li>
            <a className="hover:bg-white/10 hover:text-blue-400 rounded-lg">Notes</a>
          </li>
          <li>
            <a className="hover:bg-white/10 hover:text-blue-400 rounded-lg">YouTube</a>
          </li>
          <li>
            <a className="hover:bg-white/10 hover:text-blue-400 rounded-lg">Online Test</a>
          </li>
          <li>
            <a className="hover:bg-white/10 hover:text-blue-400 rounded-lg">About Us</a>
          </li>
          <li>
            <a className="btn bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none mt-4 shadow-lg w-full">Admin Login</a>
          </li>
        </ul>
         <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            {/* Show the user button when the user is signed in */}
            <SignedIn>
              <UserButton />
            </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
