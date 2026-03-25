import { Plane } from "lucide-react";
import OfferDetailContent from "@/components/sections/OfferDetailContent";
import Footer from "@/components/sections/Footer";

const navLinks = [
  { label: "Nos offres", href: "/listing" },
  { label: "Destinations", href: "/#destinations" },
  { label: "Témoignages", href: "/#temoignages" },
  { label: "FAQ", href: "/#faq" },
  { label: "Gallerie", href: "/gallerie" },
];

export default function OfferDetail() {
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

      
      <nav className="bg-white border-b border-separator-90">
        <div className="max-w-[1200px] mx-auto relative flex items-center justify-center px-6 sm:px-10 py-5">
          <a href="/" className="absolute left-6 sm:left-10 flex-shrink-0">
            <img
              src="/assets/figma/logo.png"
              alt="AZ Voyage"
              className="h-10 object-contain"
            />
          </a>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-black-80 font-medium text-sm tracking-tight transition-colors duration-300 hover:text-gold-100 after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-0 after:bg-gold-100 after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      
      <OfferDetailContent />

      <Footer />
    </div>
  );
}
