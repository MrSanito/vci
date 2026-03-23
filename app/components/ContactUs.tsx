import React from 'react';

const ContactUs = () => {
  return (
    <div className="bg-black py-40 px-8 relative overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-[20%] w-px h-full bg-white opacity-[0.02]"></div>
        <div className="absolute top-0 right-[20%] w-px h-full bg-white opacity-[0.02]"></div>

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center mb-32">
             <span className="text-[#FF007F] font-bold uppercase tracking-[0.8em] text-[10px] mb-8 block italic animate-pulse">Get In Touch</span>
             <h2 className="text-7xl md:text-[10rem] font-extrabold text-white font-heading tracking-tighter italic uppercase leading-none mb-12 text-glow transition-all hover:scale-105 duration-1000">Contact <br /><span className="text-[#FF007F]">Us.</span></h2>
             <p className="text-zinc-600 font-bold uppercase tracking-[0.4em] text-[11px] max-w-2xl mx-auto italic leading-loose underline decoration-white/10 decoration-2 underline-offset-[14px]">Feel free to call us or visit our institute for any inquiries regarding our courses.</p>
        </div>

        <div className="w-full max-w-5xl bg-[#0A0A0A] border border-white/5 p-16 rounded-[4rem] text-center shadow-2xl group hover:border-[#FF007F]/40 transition-all duration-1000">
             <div className="flex flex-col items-center gap-10 group">
                 <div className="w-20 h-20 bg-[#FF007F] text-white flex items-center justify-center font-extrabold text-4xl rounded-[1.8rem] rotate-12 group-hover:rotate-0 transition-transform shadow-[0_0_40px_-10px_#FF007F] italic mb-6">C</div>
                 <div className="flex flex-col gap-8 items-center">
                    <span className="text-white text-2xl font-extrabold uppercase tracking-tighter italic group-hover:text-[#FF007F] transition-colors leading-none">Call Us Now</span>
                    <a href="tel:+918115599020" className="text-white text-5xl md:text-7xl font-extrabold font-heading tracking-tighter hover:text-[#FF007F] transition-all hover:scale-105 duration-500 italic leading-none">+91 81155 990 20</a>
                    <div className="w-16 h-1 bg-[#FF007F] shadow-[0_0_15px_#FF007F] group-hover:w-48 transition-all duration-700"></div>
                 </div>
                 <div className="flex gap-12 mt-16 flex-wrap justify-center border-t border-white/5 pt-16 w-full">
                    <div className="flex flex-col gap-3">
                        <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-[0.3em] italic mb-1">Our Location</span>
                        <span className="text-white text-[11px] font-bold uppercase tracking-widest italic group-hover:text-[#FF007F] transition-colors leading-relaxed">VCI Enterprise, Delhi Complex</span>
                    </div>
                    <div className="flex flex-col gap-3">
                        <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-[0.3em] italic mb-1">Send Email</span>
                        <span className="text-white text-[11px] font-bold uppercase tracking-widest italic group-hover:text-[#FF007F] transition-colors leading-relaxed">contact@vci.com</span>
                    </div>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
