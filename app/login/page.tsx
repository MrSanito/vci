import { SignIn } from '@clerk/nextjs'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 pb-32">
      <div className="w-full max-w-lg">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-[#FF007F] text-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_-5px_#FF007F] font-bold text-3xl rotate-12 italic">V</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 font-heading tracking-tight leading-none italic">Welcome <span className="text-[#FF007F]">Back!</span></h1>
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em] italic">Sign in to your student account</p>
        </div>
        
        <div className="bg-[#0A0A0A] border border-white/5 p-8 md:p-12 rounded-[3rem] shadow-2xl">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-none p-0",
                headerTitle: "text-2xl font-bold text-white font-heading tracking-tight italic",
                headerSubtitle: "text-zinc-500 font-normal",
                socialButtonsBlockButton: "bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all rounded-xl",
                formButtonPrimary: "w-full flex items-center justify-center h-14 text-xs font-bold tracking-widest uppercase bg-[#FF007F] hover:bg-white hover:text-black transition-all rounded-xl shadow-[0_0_20px_-5px_#FF007F] border-none",
                formFieldLabel: "text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block",
                formFieldInput: "bg-black border border-white/10 text-white focus:border-[#FF007F] rounded-xl",
                footerActionLink: "text-[#FF007F] hover:text-white font-bold transition-colors",
                identityPreviewText: "text-white font-bold text-sm",
                identityPreviewEditButton: "text-[#FF007F]",
                formFieldAction: "text-zinc-400 hover:text-[#FF007F] text-[10px] font-bold uppercase tracking-widest",
                dividerLine: "bg-white/5",
                dividerText: "text-zinc-700 text-[10px] font-bold uppercase tracking-widest"
              }
            }}
            fallbackRedirectUrl="/dashboard"
          />
          
          <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-3">
            <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest italic">Safe & Secure Login</span>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-[#FF007F] rounded-full shadow-[0_0_10px_#FF007F] animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
