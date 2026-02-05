import React from "react";

const Navbar = () => {
  return (
    <div className="drawer drawer-start">
      {/* TOGGLE */}
      <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <div className="navbar bg-primary/5 shadow-sm px-6">
          {/* LEFT — INSTITUTE NAME */}
          <div className="navbar-start">
            <h3 className="text-lg font-bold whitespace-nowrap">
              Vishal Computer Institute
            </h3>
          </div>

          {/* RIGHT */}
          <div className="navbar-end">
            {/* DESKTOP MENU */}
            <ul className="menu menu-horizontal px-1 gap-2 text-sm font-medium hidden lg:flex">
              <li>
                <a>Home</a>
              </li>
              <li>
                <a>Notes</a>
              </li>
              <li>
                <a>YouTube</a>
              </li>
              <li>
                <a>Online Test</a>
              </li>
              <li>
                <a>About Us</a>
              </li>
              <li>
                <a className="btn btn-sm btn-primary text-white ml-2">
                  Admin Login
                </a>
              </li>
            </ul>

            {/* HAMBURGER — MOBILE ONLY */}
            <label
              htmlFor="mobile-drawer"
              className="btn btn-ghost text-xl lg:hidden"
            >
              ☰
            </label>
          </div>
        </div>
      </div>

      {/* SIDEBAR (RIGHT SIDE ON MOBILE) */}
      <div className="drawer-side  z-40">
        <label htmlFor="mobile-drawer" className="drawer-overlay"></label>

        <ul className="menu p-4 w-64 min-h-full bg-base-100 text-base-content space-y-2">
          <li className="text-lg font-bold mb-2">Menu</li>
          <li>
            <a>Home</a>
          </li>
          <li>
            <a>Notes</a>
          </li>
          <li>
            <a>YouTube</a>
          </li>
          <li>
            <a>Online Test</a>
          </li>
          <li>
            <a>About Us</a>
          </li>
          <li>
            <a className="btn btn-primary text-white mt-2">Admin Login</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
