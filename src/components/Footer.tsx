import { Instagram, MapPin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter */}
      <div className="border-b border-primary-foreground/10 py-16 px-6 md:px-16">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-serif-display text-3xl font-light mb-1">Join the Inner Circle</h3>
            <p className="text-xs tracking-widest text-primary-foreground/60 uppercase">Exclusive access to new arrivals & offers</p>
          </div>
          <div className="flex w-full md:w-auto gap-0 max-w-md">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent border border-primary-foreground/20 px-5 py-3.5 text-sm placeholder:text-primary-foreground/40 outline-none focus:border-primary-foreground/60 transition-colors"
            />
            <button className="bg-accent text-accent-foreground px-6 text-xs tracking-widest uppercase hover:opacity-90 transition-opacity whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="py-16 px-6 md:px-16 max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
        <div>
          {/* Logo removed */}
          <p className="text-xs leading-relaxed text-primary-foreground/50 font-sans-light">
            A style for every story. Premium fashion crafted for the modern Indian woman who dresses with confidence.
          </p>
        </div>

        <div>
          <p className="text-[9px] tracking-[0.4em] uppercase mb-6 text-primary-foreground/50">Explore</p>
          <ul className="space-y-3 text-xs text-primary-foreground/70">
            {['New Collection', 'Dresses', 'Co-ord Sets', 'Party Wear', 'Heels'].map(link => (
              <li key={link}><Link to={link === 'New Collection' ? '/collections' : `/shop?category=${encodeURIComponent(link)}`} className="hover:text-accent transition-colors">{link}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[9px] tracking-[0.4em] uppercase mb-6 text-primary-foreground/50">Support</p>
          <ul className="space-y-3 text-xs text-primary-foreground/70">
            {['Size Guide', 'Shipping & Returns', 'Care Instructions', 'FAQ', 'Contact Us'].map(link => (
              <li key={link}><a href="#" className="hover:text-accent transition-colors">{link}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[9px] tracking-[0.4em] uppercase mb-6 text-primary-foreground/50">Connect</p>
          <div className="space-y-3 text-xs text-primary-foreground/70">
            <a href="#" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Instagram size={14} strokeWidth={1.5} /> @herstyle.in
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Mail size={14} strokeWidth={1.5} /> hello@herstyle.in
            </a>
            <p className="flex items-start gap-2">
              <MapPin size={14} strokeWidth={1.5} className="mt-0.5 shrink-0" />
              <span>Fashion Street, Mumbai – 400001</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10 py-5 px-6 md:px-16 max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-[10px] text-primary-foreground/30 tracking-wider">© 2026 Her Style. All rights reserved.</p>
        <p className="text-[10px] text-primary-foreground/30 tracking-wider">A Style for Every Story · Made in India</p>
      </div>
    </footer>
  );
};
