import { useEffect, useRef, useState } from "react";
import { Plane } from "lucide-react";
import OffersSection from "../../components/sections/OffersSection";
import DestinationsSection from "../../components/sections/DestinationsSection";
import TestimonialsSection from "../../components/sections/TestimonialsSection";
import FAQSection from "../../components/sections/FAQSection";
import BookingProcessSection from "../../components/sections/BookingProcessSection";
import Footer from "../../components/sections/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";
import { resolveHomePageMedia, useHomePage } from "@/hooks/useHomePage";
import styles from "./Index.module.css";

const navLinks = [
  { label: "Nos offres", href: "/listing" },
  { label: "Destinations", href: "#destinations" },
  { label: "Témoignages", href: "#temoignages" },
  { label: "FAQ", href: "#faq" },
  { label: "Gallerie", href: "/gallerie" },

];

export default function Index() {
  const heroVisualsRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const { data: homePage } = useHomePage();

  useEffect(() => {
    const el = heroVisualsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeroVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  usePageMeta({
    title: "Agence de voyage en Algérie — Séjours, Omra & Voyages sur mesure",
    description: "AZ Voyage, votre agence de voyage en Algérie. Découvrez nos offres de séjours, Omra et voyages sur mesure vers Istanbul, Dubaï, Le Caire et plus.",
    appendSiteName: true,
  });

  const skyMedia = resolveHomePageMedia(homePage?.hero?.sky, {
    src: "/assets/figma/sky.png",
    alt: "Ciel",
  });
  const logoMedia = resolveHomePageMedia(homePage?.hero?.logo, {
    src: "/assets/figma/logo.png",
    alt: "AZ Voyage",
  });
  const testimonialAvatar = resolveHomePageMedia(homePage?.hero?.testimonialAvatar, {
    src: "/assets/figma/testimonial.png",
    alt: "Voyageur",
  });
  const heroTravelers = [
    {
      src: "/assets/figma/WhatsApp Image 2026-03-16 at 20.00.51.jpeg",
      alt: "Voyageur AZ 2",
    },
    {
      src: "/assets/figma/WhatsApp Image 2026-03-16 at 20.00.55.jpeg",
      alt: "Voyageur AZ 3",
    },
    {
      src: "/assets/figma/Ellipse w.png",
      alt: "Voyageuse AZ",
    },
  ];
  const tajMedia = resolveHomePageMedia(homePage?.hero?.taj, {
    src: "/assets/figma/taj.png",
    alt: "Taj Mahal",
  });
  const eiffelMedia = resolveHomePageMedia(homePage?.hero?.eiffel, {
    src: "/assets/figma/eiffel.png",
    alt: "Tour Eiffel",
  });
  const petraMedia = resolveHomePageMedia(homePage?.hero?.petra, {
    src: "/assets/figma/petra.png",
    alt: "Pétra",
  });
  const pyramidsMedia = resolveHomePageMedia(homePage?.hero?.pyramids, {
    src: "/assets/figma/pyramids.png",
    alt: "Pyramides",
  });
  const statueMedia = resolveHomePageMedia(homePage?.hero?.statue, {
    src: "/assets/figma/statue.png",
    alt: "Statue of Liberty",
  });
  const colosseumMedia = resolveHomePageMedia(homePage?.hero?.colosseum, {
    src: "/assets/figma/colosseum.png",
    alt: "Colisée",
  });
  const planeMedia = resolveHomePageMedia(homePage?.hero?.plane, {
    src: "/assets/figma/plane.png",
    alt: "Avion",
  });

  return (
    <div className="min-h-screen min-w-screen bg-white">
      
      <div className="bg-navy-100 text-white py-2 px-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Plane className="w-5 h-5" />
          <p className="text-sm font-medium tracking-tight">
            Travel to any wished destination
          </p>
        </div>
      </div>

      
      <section className="relative bg-white px-4 sm:px-6 lg:px-10 py-6 flex flex-col items-center justify-center">
        <div className="relative w-full min-h-[820px] bg-navy-10" style={{ clipPath: "inset(0 round 28px)" }}>
          <div className="absolute inset-0">
            {skyMedia.isVideo ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={skyMedia.src} type="video/mp4" />
              </video>
            ) : (
              <img
                src={skyMedia.src}
                alt={skyMedia.alt}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/10 to-white/90" />
            <div className="absolute -top-24 right-0 h-[420px] w-[420px] rounded-full bg-gold-100/15 blur-3xl animate-glow-pulse" />
            <div className="absolute -bottom-24 left-0 h-[360px] w-[360px] rounded-full bg-navy-100/10 blur-3xl animate-glow-pulse animation-delay-300" />
          </div>

          
          <nav className="relative z-20 flex items-center justify-between px-6 sm:px-10 lg:px-14 pt-8">
            <div className="w-[96px] h-[64px] animate-fade-up">
              <img
                src={logoMedia.src}
                alt={logoMedia.alt}
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 ml-[10px] hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative text-black-100 font-medium text-base tracking-tight transition-colors duration-300 hover:text-gold-100 after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-0 after:bg-gold-100 after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>

          
          <div className="relative z-30 flex w-full flex-col items-center gap-6 px-4 pt-16 sm:px-10 lg:px-14">
            <div className="inline-flex items-center gap-3 bg-transparent backdrop-blur-sm rounded-full px-5 py-2.5 text-white animate-fade-up w-auto">
              <div className="flex -space-x-2">
                {heroTravelers.map((traveler) => (
                  <div
                    key={traveler.src}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 overflow-hidden relative z-0"
                  >
                    <img
                      src={traveler.src}
                      alt={traveler.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-navy-10 text-white bg-navy-100 flex items-center justify-center relative z-10">
                  <span className="text-[11px] font-semibold">+50</span>
                </div>
              </div>
              <p className="text-sm font-medium tracking-tight">
                Personnes ont voyagé avec nous !
              </p>
            </div>

            <div className="mx-auto flex w-full max-w-[980px] flex-col items-center text-center">
              <h1 className="mt-2 text-center font-jakarta text-[40px] font-bold leading-[1.15] tracking-[-1.6px] animate-fade-up animation-delay-200 sm:text-[52px] md:text-[64px] lg:whitespace-nowrap">
                <span className="text-black-100">L'art de réaliser </span>
                <span className="text-gold-100">vos voyages</span>
              </h1>

              <p className="max-w-[700px] text-center text-lg leading-relaxed tracking-[-0.6px] text-black-60 animate-fade-up animation-delay-300 sm:text-[20px] md:text-[22px]">
                Choisissez une offre du moment ou créez votre voyage sur mesure, on vous accompagne avant, pendant et après la réservation.
              </p>

              <div className="mt-6 flex w-full flex-col items-center justify-center gap-4 animate-fade-up animation-delay-400 sm:flex-row">
                <a
                  href="#offres"
                  className="bg-navy-100 text-white px-8 py-4 rounded-full font-medium text-[17px] tracking-tight hover:bg-navy-90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  Voir les offres du moment
                </a>
                <a
                  href="/voyage-sur-mesure"
                  className="bg-white text-navy-100 px-8 py-4 rounded-full font-medium text-[17px] tracking-tight border border-navy-20 hover:border-navy-40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  Demander un voyage sur mesure
                </a>
              </div>
            </div>
          </div>

          
          <div
            ref={heroVisualsRef}
            className="absolute bottom-0 left-0 right-0 h-[380px] sm:h-[400px] lg:h-[440px] pointer-events-none"
          >
            <div className={`relative w-full h-full max-w-[1200px] mx-auto ${heroVisible ? styles.animate : ""}`}>
              
              <img
                src={tajMedia.src}
                alt={tajMedia.alt}
                className={styles.tajMahal}
              />
              
              <img
                src={eiffelMedia.src}
                alt={eiffelMedia.alt}
                className={styles.eiffel}
              />
              
              <img
                src={petraMedia.src}
                alt={petraMedia.alt}
                className={styles.petra}
              />
              
              <img
                src={pyramidsMedia.src}
                alt={pyramidsMedia.alt}
                className={styles.pyramids}
              />
              
              <img
                src={statueMedia.src}
                alt={statueMedia.alt}
                className={styles.statue}
              />
              
              <img
                src={colosseumMedia.src}
                alt={colosseumMedia.alt}
                className={styles.colosseum}
              />
              
              <img
                src={planeMedia.src}
                alt={planeMedia.alt}
                className={styles.airplane}
              />
            </div>
          </div>
        </div>
      </section>

      
      <OffersSection />
      <DestinationsSection />
      <BookingProcessSection />
      <TestimonialsSection />
      <FAQSection />

      <Footer />
    </div>
  );
}
