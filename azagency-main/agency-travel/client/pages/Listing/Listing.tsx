import { Plane, Search } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Listing.module.css";
import ListingContent from "../../components/sections/ListingContent";
import Footer from "../../components/sections/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";

const navLinks = [
  { label: "Nos offres", href: "/listing" },
  { label: "Destinations", href: "/#destinations" },
  { label: "Témoignages", href: "/#temoignages" },
  { label: "FAQ", href: "/#faq" },
  { label: "Gallerie", href: "/gallerie" },
];

export default function Listing() {
  const location = useLocation();

  usePageMeta({
    title: "Nos offres de voyage",
    description: "Parcourez toutes nos offres de séjours, Omra et voyages organisés. Filtrez par destination, budget et durée.",
  });

  const initialCountry =
    new URLSearchParams(location.search).get("country")?.trim() || "all";
  const initialRegion =
    new URLSearchParams(location.search).get("region")?.trim() || "Tout";
  const initialDestination =
    new URLSearchParams(location.search).get("destination")?.trim() || "all";
  const initialDestinationFilter =
    new URLSearchParams(location.search).get("destinationFilter")?.trim() || "all";

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Searching for:", searchQuery);
  };

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

      
      <section className="relative w-[95%] mx-auto mt-4">
        <div className={styles.heroContainer}>
          
          <video
            autoPlay
            loop
            muted
            playsInline
            className={styles.videoBackground}
          >
            <source
              src="/assets/figma/morocco-cinematic-travel-video-morocco-marrakech-visitmorocco-cinem_1qCOeR8B.mp4"
              type="video/mp4"
            />
          </video>

          
          <div className={styles.videoOverlay} />

          
          <nav className={styles.navigation}>
            <div className={styles.logoContainer}>
              <img
                src="/assets/figma/logo.png"
                alt="AZ Voyage"
                className={styles.logo}
              />
            </div>

            <div className={styles.navLinks}>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={styles.navLink}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>

          
          <div className={styles.watermark}>MOROCCO</div>

          
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Explorez toutes <span className={styles.highlightText}>nos offres</span> disponibles
            </h1>

            <p className={styles.heroSubtitle}>
              Filtrez par destination, période ou type de séjour, et découvrez les offres
              disponibles avec hôtels au choix.
            </p>

            
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input
                type="text"
                placeholder="Rechercher une destination"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchButton}>
                <Search className="w-5 h-5" />
                <span>Rechercher</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      
      <ListingContent
        searchQuery={searchQuery}
        initialCountry={initialCountry}
        initialRegion={initialRegion}
        initialDestination={initialDestination}
        initialDestinationFilter={initialDestinationFilter}
      />

      <Footer />
    </div>
  );
}
