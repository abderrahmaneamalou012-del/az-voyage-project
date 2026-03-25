import { Facebook, Instagram, ArrowRight } from "lucide-react";

const decorativeImageSrc = "/assets/figma/footer%20picture%20.png";

const Footer = () => {
    return (
        <footer className="bg-navy-100 text-white overflow-hidden">
            
            <div className="px-6 sm:px-10 lg:px-16 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-navy-90">
                <h2 className="font-jakarta font-bold text-2xl sm:text-[28px] tracking-tight leading-tight">
                    <span className="text-white">Votre prochaine escapade</span>
                    <br />
                    <span className="text-navy-40 italic">commence ici.</span>
                </h2>
                <a
                    href="/listing"
                    className="inline-flex items-center gap-2 border border-white/30 text-white px-5 py-2.5 rounded-full text-sm font-medium tracking-tight hover:bg-white hover:text-navy-100 transition-all duration-300"
                >
                    Explorer nos offres
                    <ArrowRight className="w-4 h-4" />
                </a>
            </div>

            
            <div className="px-6 sm:px-10 lg:px-16 py-10 relative">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
                    
                    <div className="max-w-[280px]">
                        <div className="w-[80px] h-[54px] mb-5">
                            <img
                                src="/assets/figma/logo.png"
                                alt="AZ Voyage"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <p className="text-navy-40 text-sm leading-relaxed tracking-tight mb-6">
                            AZ Voyage organise des séjours et offres prêtes à réserver, avec des informations claires et une assistance jusqu'au départ
                        </p>
                        <div className="flex items-center gap-2">
                            <a
                                href="https://web.facebook.com/p/Az-Voyage-61554836281308/?_rdc=1&_rdr"
                                target="_blank"
                                rel="noreferrer"
                                className="w-9 h-9 bg-navy-90 rounded-full flex items-center justify-center hover:bg-navy-60 transition-all duration-300"
                            >
                                <Facebook className="w-4 h-4 text-navy-10" />
                            </a>
                            <a
                                href="https://www.instagram.com/az_voyage/"
                                target="_blank"
                                rel="noreferrer"
                                className="w-9 h-9 bg-navy-90 rounded-full flex items-center justify-center hover:bg-navy-60 transition-all duration-300"
                            >
                                <Instagram className="w-4 h-4 text-navy-10" />
                            </a>
                        </div>
                    </div>

                    
                    <div>
                        <h3 className="font-jakarta font-medium text-lg tracking-tight mb-4">
                            Contact
                        </h3>
                        <div className="space-y-2">
                            <p className="text-navy-40 text-sm tracking-tight hover:text-gold-100 transition-colors duration-300 cursor-pointer">
                                0662901937 / 0791916990
                            </p>
                            <p className="text-navy-40 text-sm tracking-tight hover:text-gold-100 transition-colors duration-300 cursor-pointer">
                                reservation@az-tour.com
                            </p>
                        </div>
                    </div>

                    
                    <div>
                        <h3 className="font-jakarta font-medium text-lg tracking-tight mb-4">
                            Location
                        </h3>
                        <p className="text-navy-40 text-sm leading-relaxed tracking-tight max-w-[220px]">
                            Résidence Dar Diaf bouchaoui 3,
                            <br />
                            Cheraga
                        </p>
                    </div>
                </div>

                
                <img
                    src={decorativeImageSrc}
                    alt=""
                    className="pointer-events-none absolute -right-10 -bottom-8 hidden xl:block w-[300px] opacity-20"
                />
            </div>
        </footer>
    );
};

export default Footer;
