import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { heroModelImg, heroCloseupImg, editorialBannerImg } from '@/data/products';
import { Instagram, Mail, MapPin } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <CartDrawer />
      <main className="pt-20">
        {/* Hero */}
        <div className="relative h-[70vh] overflow-hidden">
          <img src={editorialBannerImg} alt="About Élysée" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center text-center">
            <div className="text-primary-foreground">
              <p className="text-[10px] tracking-[0.5em] uppercase mb-4 opacity-80">Est. 2020 · New Delhi</p>
              <h1 className="font-serif-display text-6xl md:text-8xl font-light">ÉLYSÉE</h1>
              <p className="font-sans-light text-sm tracking-widest opacity-70 mt-4 max-w-md mx-auto">
                A luxury fashion label crafted for the modern woman who lives boldly and dresses with intention.
              </p>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="max-w-screen-xl mx-auto px-6 md:px-16 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-6">Our Story</p>
              <h2 className="font-serif-display text-4xl md:text-5xl font-light leading-tight mb-8">
                Born from a love of<br />timeless elegance
              </h2>
              <div className="space-y-5 font-sans-light text-sm leading-relaxed text-muted-foreground">
                <p>
                  Élysée was founded in 2020 with a singular vision: to create fashion that celebrates femininity without compromise. Inspired by the editorial grandeur of Paris and the vibrant spirit of modern India, every piece is designed to make you feel extraordinary.
                </p>
                <p>
                  Our collections are thoughtfully curated — from fluid silk dresses that move like water, to structured co-ord sets that command attention in any room. We believe great fashion is not about trends. It's about owning your story.
                </p>
                <p>
                  Each piece is crafted with intention, using premium fabrics sourced responsibly, with an unwavering attention to cut, silhouette, and detail.
                </p>
              </div>
            </div>
            <div className="relative">
              <img src={heroModelImg} alt="Élysée Brand" className="w-full aspect-[3/4] object-cover object-top" />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-8 max-w-xs">
                <p className="font-serif-display text-3xl font-light mb-1">200+</p>
                <p className="text-[10px] tracking-widest uppercase opacity-60">Pieces per collection</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-secondary py-24 px-6 md:px-16">
          <div className="max-w-screen-xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-3">What We Stand For</p>
              <h2 className="font-serif-display text-4xl font-light">Our Values</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { num: '01', title: 'Premium Craft', desc: 'Every stitch, seam, and fabric is chosen with meticulous care. We partner with India\'s finest artisans to ensure lasting quality.' },
                { num: '02', title: 'Conscious Fashion', desc: 'We are committed to responsible sourcing, ethical production, and reducing our environmental footprint season after season.' },
                { num: '03', title: 'Radical Confidence', desc: 'Élysée is not just clothing — it\'s a declaration. We design for women who know exactly who they are and wear it with pride.' },
              ].map(v => (
                <div key={v.num} className="border-t border-border pt-8">
                  <p className="font-serif-display text-4xl font-light text-muted-foreground/30 mb-4">{v.num}</p>
                  <h3 className="font-serif-display text-xl font-light mb-3">{v.title}</h3>
                  <p className="font-sans-light text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Split editorial */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="aspect-square overflow-hidden">
            <img src={heroCloseupImg} alt="Élysée Editorial" className="w-full h-full object-cover" />
          </div>
          <div className="bg-primary text-primary-foreground flex items-center justify-center p-16">
            <div>
              <p className="text-[10px] tracking-[0.5em] uppercase opacity-60 mb-6">The Philosophy</p>
              <blockquote className="font-serif-display text-3xl md:text-4xl font-light leading-tight mb-6">
                "Fashion is the armour to survive the reality of everyday life."
              </blockquote>
              <p className="font-sans-light text-xs tracking-widest opacity-50 uppercase">— Diana Vreeland</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="max-w-screen-xl mx-auto px-6 md:px-16 py-24">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-3">Get in Touch</p>
            <h2 className="font-serif-display text-4xl font-light">Contact Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-3xl mx-auto text-center">
            {[
              { icon: <Instagram size={22} strokeWidth={1.5} />, title: 'Instagram', detail: '@elysee.studio', href: '#' },
              { icon: <Mail size={22} strokeWidth={1.5} />, title: 'Email', detail: 'hello@elysee.in', href: 'mailto:hello@elysee.in' },
              { icon: <MapPin size={22} strokeWidth={1.5} />, title: 'Flagship Store', detail: '42 Mehrauli Road, New Delhi – 110030', href: '#' },
            ].map(item => (
              <a key={item.title} href={item.href} className="group flex flex-col items-center gap-4 p-8 border border-border hover:border-foreground transition-all duration-300">
                <span className="group-hover:text-accent transition-colors">{item.icon}</span>
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-1">{item.title}</p>
                  <p className="font-sans-light text-sm">{item.detail}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
