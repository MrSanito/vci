import React from "react";

const ContactSection = () => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-16 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
        {/* LEFT — CONTACT FORM */}
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-lg">
          {/* Logo Avatar */}
          <div className="flex justify-center mb-6">
            <img
              src="https://api.dicebear.com/7.x/initials/svg?seed=VC"
              alt="Logo"
              className="w-20 h-20 rounded-full border-2 border-blue-400 bg-white p-2"
            />
          </div>

          <h2 className="text-2xl font-bold text-center mb-6">Contact Us</h2>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered w-full bg-white/20 text-white placeholder-gray-300"
            />
            <input
              type="text"
              placeholder="Subject"
              className="input input-bordered w-full bg-white/20 text-white placeholder-gray-300"
            />
            <input
              type="email"
              placeholder="E-mail"
              className="input input-bordered w-full bg-white/20 text-white placeholder-gray-300"
            />
            <textarea
              placeholder="How can we help you?"
              className="textarea textarea-bordered w-full bg-white/20 text-white placeholder-gray-300 h-28"
            ></textarea>

            <button className="btn btn-primary w-full text-white">
              Send Message
            </button>
          </form>
        </div>

        {/* RIGHT — INSTITUTE INFO */}
        <div className="space-y-5">
          <h3 className="text-xl font-bold">Vishal Computer Classes</h3>

          <p className="text-gray-300">
            Regd. No. 2302/1-169892 | Approved By U.P Government
            <br />
            An ISO 9001:2015 Certified Institute
          </p>

          <p className="text-gray-300">
            Gandhi Nagar, Rura
            <br />
            Uttar Pradesh, India
          </p>

          <p className="text-gray-300">Email: example@email.com</p>

          <div className="space-y-2">
            <a className="text-blue-400 hover:underline block">
              YouTube Channel
            </a>
            <a className="text-blue-400 hover:underline block">
              Second YouTube Channel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
