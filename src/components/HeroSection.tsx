import { heroModelImg, heroCloseupImg } from '@/data/products';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen flex">
      {/* Left Panel - Model */}
      <div className="relative w-full md:w-3/5 overflow-hidden">
        <img
          src={heroModelImg}
          alt="Spring Summer Collection 2026"
          className="w-full h-full object-cover object-top min-h-screen"
        />
        {/* Overlay text */}
        <div className="absolute inset-0 flex flex-col justify-end p-12 md:p-16 bg-gradient-to-t from-foreground/40 via-transparent to-transparent">
          <div className="text-primary-foreground fade-in">
            {/* Logo on hero */}
            <div className="mb-6">
              {/* Logo removed */}
            </div>
            <p className="font-sans-light text-sm tracking-widest opacity-80 mb-2">A Style for Every Story</p>
            <h1 className="font-serif-display text-4xl md:text-6xl leading-none font-light mb-3">
              Spring / Summer<br />Collection 2026
            </h1>
            <p className="font-sans-light text-sm tracking-widest opacity-70 mb-8">Modern Elegance for Confident Women</p>
            <Link
              to="/collections"
              className="inline-block border border-primary-foreground px-8 py-3.5 text-xs tracking-widest uppercase hover:bg-primary-foreground hover:text-foreground transition-all duration-300"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </div>

      {/* Right Panel - Closeup */}
      <div className="hidden md:flex w-2/5 flex-col">
        <div className="relative flex-1 overflow-hidden">
          <img
            src={heroCloseupImg}
            alt="Fashion editorial"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-8 right-8 text-right">
            <p className="text-[9px] tracking-[0.4em] uppercase text-primary-foreground/80 mb-1">New Arrivals</p>
            <p className="font-serif-display text-lg text-primary-foreground font-light">SS '26</p>
          </div>
        </div>
        {/* Stat bar */}
        <div className="bg-primary text-primary-foreground px-10 py-6 flex items-center justify-between">
          <div>
            <p className="font-serif-display text-2xl">200+</p>
            <p className="text-[9px] tracking-widest uppercase opacity-60 mt-0.5">New Pieces</p>
          </div>
          <div className="w-px h-8 bg-primary-foreground/20" />
          <div>
            <p className="font-serif-display text-2xl">SS '26</p>
            <p className="text-[9px] tracking-widest uppercase opacity-60 mt-0.5">Season</p>
          </div>
          <div className="w-px h-8 bg-primary-foreground/20" />
          <div>
            <p className="font-serif-display text-2xl">Free</p>
            <p className="text-[9px] tracking-widest uppercase opacity-60 mt-0.5">Shipping ₹2999+</p>
          </div>
        </div>
      </div>
    </section>
  );
};
