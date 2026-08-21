import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { ArrowRight, CheckCircle2, Link2, ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import urlAnimation from "../assets/UrlLink.lottie";

const Header = () => (
  <header className="grid items-center gap-10 py-10 sm:py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
    <div className="animate-rise">
      <div className="mb-6 flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-[#b6533d]">
        <Link2 size={15} /> The quieter way to share
      </div>
      <h1 className="max-w-2xl text-5xl font-bold leading-[.98] tracking-tight sm:text-7xl">
        Long links.
        <br />
        <span className="text-[#b6533d]">Short story.</span>
      </h1>
      <p className="mt-7 max-w-lg font-sans text-base leading-7 text-[#687069]">
        Urlhandler turns messy URLs into clear, compact links that are easier to
        share, remember, and understand.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/signup" className="ink-button">
          Create your first link <ArrowRight size={16} />
        </Link>
        <Link to="/login" className="outline-button">
          Sign in
        </Link>
      </div>
      <div className="mt-10 flex flex-wrap gap-5 font-sans text-xs text-[#687069]">
        <span className="flex items-center gap-2">
          <CheckCircle2 size={15} className="text-[#6c9a72]" /> No credit card
        </span>
        <span className="flex items-center gap-2">
          <ShieldCheck size={15} className="text-[#6c9a72]" /> Your links, your
          data
        </span>
      </div>
    </div>
    <div className="animate-rise delay-1 relative flex min-h-[340px] items-center justify-center overflow-hidden rounded-sm border border-[#ded6ca] bg-[#e9dfc6] p-4">
      <div className="absolute left-7 top-7 h-20 w-20 rounded-full bg-[#e7c66c]" />
      <div className="absolute bottom-8 right-8 h-28 w-28 rounded-full bg-[#d37a61] opacity-80" />
      <DotLottieReact
        className="relative z-10 aspect-square w-64 sm:w-80"
        src={urlAnimation}
        loop
        autoplay
      />
    </div>
  </header>
);

export default Header;
