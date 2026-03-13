import editorialBannerImg from '@/assets/editorial-banner.jpg';

export const EditorialSection = () => {
  return (
    <section className="relative overflow-hidden min-h-[70vh] flex items-center">
      <img
        src={editorialBannerImg}
        alt="New Collection Editorial"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-foreground/50" />

      <div className="relative z-10 px-6 md:px-16 max-w-screen-xl mx-auto w-full">
        <div className="max-w-lg fade-in">
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary-foreground/70 mb-6">Editorial</p>
          <h2 className="font-serif-display text-5xl md:text-7xl text-primary-foreground font-light leading-tight mb-8">
            Unveiling<br />the New<br />Collection
          </h2>
          <a
            href="#"
            className="inline-block border border-primary-foreground px-8 py-3.5 text-xs tracking-widest uppercase text-primary-foreground hover:bg-primary-foreground hover:text-foreground transition-all duration-300"
          >
            Explore Now
          </a>
        </div>
      </div>
    </section>
  );
};
