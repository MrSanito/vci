import React from "react";

const ContactSection = () => {
  return (
    <div className="bg-slate-950 text-white py-24 px-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* LEFT — CONTACT FORM */}
        <div className="glass-panel backdrop-blur-2xl rounded-3xl p-10 shadow-2xl relative hover:border-blue-500/30 transition-all duration-500">
           {/* Decorative Orb inside form */}
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl opacity-20 pointer-events-none"></div>

          {/* Logo Avatar */}
          <div className="flex justify-center mb-8 relative z-10">
            <div className="p-1 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 shadow-lg shadow-purple-500/20">
                <img
                src="https://api.dicebear.com/7.x/initials/svg?seed=VC"
                alt="Logo"
                className="w-24 h-24 rounded-full border-4 border-slate-900 bg-white p-2"
                />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Get in Touch</h2>

          <form className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                type="text"
                placeholder="Name"
                className="input input-lg w-full bg-slate-900/40 border border-white/10 focus:border-blue-500 focus:bg-slate-900/60 focus:outline-none text-white placeholder-slate-500 transition-all rounded-xl"
                />
                <input
                type="text"
                placeholder="Subject"
                className="input input-lg w-full bg-slate-900/40 border border-white/10 focus:border-blue-500 focus:bg-slate-900/60 focus:outline-none text-white placeholder-slate-500 transition-all rounded-xl"
                />
            </div>
            <input
              type="email"
              placeholder="E-mail"
              className="input input-lg w-full bg-slate-900/40 border border-white/10 focus:border-blue-500 focus:bg-slate-900/60 focus:outline-none text-white placeholder-slate-500 transition-all rounded-xl"
            />
            <textarea
              placeholder="How can we help you?"
              className="textarea textarea-lg w-full bg-slate-900/40 border border-white/10 focus:border-blue-500 focus:bg-slate-900/60 focus:outline-none text-white placeholder-slate-500 h-40 transition-all rounded-xl resize-none"
            ></textarea>

            <button className="btn btn-lg w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none shadow-lg hover:shadow-purple-600/30 hover:scale-[1.02] transition-all duration-300 rounded-xl font-bold tracking-wide">
              Send Message
            </button>
          </form>
        </div>

        {/* RIGHT — INSTITUTE INFO */}
        <div className="space-y-10 pl-4">
          <div>
            <h3 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-glow leading-tight">
                Vishal Computer<br/>Classes
            </h3>
            <div className="h-1.5 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-6 group">
                <div className="mt-1 p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                    <h4 className="text-white font-semibold text-lg mb-1">Certified Excellence</h4>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Regd. No. 2302/1-169892 <br/> Approved By U.P Government
                        <br />
                        <span className="text-blue-400 font-semibold">An ISO 9001:2015 Certified Institute</span>
                    </p>
                </div>
            </div>

            <div className="flex items-start gap-6 group">
                <div className="mt-1 p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                    <h4 className="text-white font-semibold text-lg mb-1">Visit Us</h4>
                    <p className="text-slate-400 text-lg">
                        Gandhi Nagar, Rura
                        <br />
                        Uttar Pradesh, India
                    </p>
                </div>
            </div>
            {/* Additional info omitted for brevity in replacement but can be kept if desired. Keeping core info */}
          </div>


             <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-pink-500/10 rounded-lg text-pink-400">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <p className="text-slate-300 text-lg">Email: example@email.com</p>
            </div>
          
          <div className="pt-6 border-t border-white/10">
            <h4 className="text-lg font-semibold mb-4 text-white">Follow Us</h4>
            <div className="flex gap-4">
                <a className="btn btn-circle btn-ghost bg-white/5 hover:bg-red-600 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.418-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 12 5 12 5s6.256 0 7.812.418zM15.194 12 10 15V9l5.194 3z" clipRule="evenodd" /></svg>
                </a>
                <a className="btn btn-circle btn-ghost bg-white/5 hover:bg-blue-600 hover:text-white transition-colors">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
