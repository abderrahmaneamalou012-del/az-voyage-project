import { MessageCircle, CheckCircle, Hotel } from "lucide-react";
import { useTestimonials } from "@/hooks/useTestimonials";
import { resolveImageUrl } from "@/lib/payload";


const fallbackTestimonials = [
  { id: "1", text: "Très sérieux. Ils répondent vite sur WhatsApp et expliquent tout (inclus / non inclus)", author: "Flown Marketing", date: "Septembre 2025", rating: 5, type: "text" as const },
  { id: "2", text: "Franchement, expérience très rassurante du début à la fin. J'avais peur de réserver en ligne, mais tout était expliqué clairement : les dates, ce qui est inclus, les options d'hôtel, et même les détails du transfert.", author: "Flown Marketing", date: "Septembre 2025", rating: 5, type: "text" as const },
  { id: "3", text: "On a réservé une option d'hôtel, ils ont confirmé la disponibilité rapidement. Très pro", author: "Flown Marketing", date: "Septembre 2025", rating: 5, type: "text" as const },
  { id: "4", text: "Bon rapport qualité/prix et surtout un suivi vraiment rassurant.", author: "Flown Marketing", date: "Septembre 2025", rating: 5, type: "text" as const },
];

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-1">
    {[...Array(count)].map((_, i) => (
      <svg
        key={i}
        className="w-3.5 h-3.5 fill-gold-100"
        viewBox="0 0 12 12"
      >
        <path d="M11.9908 4.80515C12.0507 4.49072 11.8109 4.1134 11.5111 4.1134L8.09376 3.6103L6.53496 0.340189C6.47501 0.214415 6.41505 0.151528 6.29514 0.0886414C5.99538 -0.100019 5.63565 0.0257547 5.45579 0.340189L3.95695 3.6103L0.539584 4.1134C0.359723 4.1134 0.239815 4.17628 0.179861 4.30206C-0.0599538 4.5536 -0.0599538 4.93092 0.179861 5.18247L2.63797 7.69794L2.03843 11.2825C2.03843 11.4083 2.03843 11.534 2.09838 11.6598C2.27824 11.9742 2.63797 12.1 2.93773 11.9114L5.99538 10.2134L9.05302 11.9114C9.11297 11.9742 9.23288 11.9742 9.35279 11.9742C9.41274 11.9742 9.41274 11.9742 9.47269 11.9742C9.77246 11.9114 10.0123 11.5969 9.95232 11.2196L9.35279 7.63506L11.8109 5.11959C11.9308 5.0567 11.9908 4.93093 11.9908 4.80515Z" />
      </svg>
    ))}
  </div>
);

const TestimonialsSection = () => {
  const { data: cmsTestimonials } = useTestimonials();
  const allItems = cmsTestimonials?.length ? cmsTestimonials : fallbackTestimonials;

  const textItems = allItems.filter((t) => t.type !== "video");
  const videoItem = allItems.find((t) => t.type === "video");
  const videoSrc = videoItem
    ? resolveImageUrl((videoItem as any).video, (videoItem as any).videoUrl) || "/assets/videos/SnapInsta.to_AQMAHRM57p7nModboS3yXZBxNOz90lKZYaFnnGdo1VKx2MXyCJQP-hZTYYqLX7eM1DYaKtdnvLTzJNLXZSwfBlgEDDyU884nCksX4O0.mp4"
    : "/assets/videos/SnapInsta.to_AQMAHRM57p7nModboS3yXZBxNOz90lKZYaFnnGdo1VKx2MXyCJQP-hZTYYqLX7eM1DYaKtdnvLTzJNLXZSwfBlgEDDyU884nCksX4O0.mp4";
  const videoImageSrc = videoItem
    ? resolveImageUrl((videoItem as any).videoImage, (videoItem as any).videoImageUrl) || "/assets/figma/testimonial.png"
    : "/assets/figma/testimonial.png";
  const videoQuoteText = (videoItem as any)?.videoQuote || "Organisation au top, tout était clair dès le départ. On a reçu les infos et l'assistance quand il fallait.";
  const videoAuthorText = videoItem ? `- ${videoItem.author}, ${videoItem.date}` : "- Flown Marketing, Septembre 2025";
  return (
    <section id="temoignages" className="bg-[#F3F3F3] px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1380px]">
        <div className="-mt-5 mb-12 text-center">
          <h2 className="font-jakarta font-bold text-[34px] sm:text-[44px] tracking-[-2px] leading-[1.08]">
            <span className="text-black-100">Ce que disent </span>
            <span className="text-gold-100">nos voyageurs</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[420px] text-[17px] leading-[1.5] tracking-[-0.6px] text-black-50 sm:text-[20px]">
            Chaque voyage est organisé avec clarté, disponibilité confirmée et assistance
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[290px_400px_minmax(0,1fr)] xl:grid-cols-[310px_420px_minmax(0,1fr)]">
          <div className="flex min-h-[460px] flex-col justify-between rounded-2xl bg-white p-7 sm:p-8">
            <div>
              <h3 className="max-w-[220px] font-jakarta text-[30px] font-bold leading-[1.08] tracking-[-1.2px] text-black-100">
                Basé sur 200+ avis de voyageurs
              </h3>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-black-40" />
                  <span className="text-[15px] leading-[1.6] tracking-[-0.3px] text-black-50">
                    Assistance WhatsApp avant et pendant le voyage
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-black-40" />
                  <span className="text-[15px] leading-[1.6] tracking-[-0.3px] text-black-50">
                    Disponibilité confirmée avant validation
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Hotel className="mt-0.5 h-4 w-4 flex-shrink-0 text-black-40" />
                  <span className="text-[15px] leading-[1.6] tracking-[-0.3px] text-black-50">
                    Hôtels au choix selon l'offre
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <p className="mb-4 text-[12px] italic tracking-[-0.2px] text-black-40">
                Prêt à préparer votre prochain départ ?
              </p>
              <a
                href="#offres"
                className="inline-flex items-center justify-center rounded-full bg-navy-100 px-5 py-2.5 font-medium text-[14px] tracking-[-0.3px] text-white transition-all duration-300 hover:bg-navy-90 hover:shadow-lg hover:-translate-y-0.5"
              >
                Voir nos offres
              </a>
            </div>
          </div>

          <div className="w-full lg:w-[360px] flex-shrink-0 rounded-2xl relative overflow-hidden group min-h-[520px]">
            <video
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              src={videoSrc}
              poster={videoImageSrc}
              controls
              loop
              playsInline
              preload="metadata"
            />

            <div className="absolute top-0 left-0 right-0 p-5 pointer-events-none">
              <p className="font-jakarta font-semibold text-base leading-snug tracking-tight text-white mb-3">
                "{videoQuoteText}"
              </p>
              <span className="text-white/70 text-sm italic tracking-tight">
                {videoAuthorText}
              </span>
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden max-h-[520px]">
            <div className="absolute left-0 right-0 top-0 h-10 bg-gradient-to-b from-[#F3F3F3] to-transparent z-10 pointer-events-none" />
            <div className="absolute left-0 right-0 bottom-0 h-10 bg-gradient-to-t from-[#F3F3F3] to-transparent z-10 pointer-events-none" />

            <div className="flex flex-col gap-3 animate-marquee-vertical">
              {textItems.map((t, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl px-5 py-5 border border-separator-90 hover:border-gold-100 transition-all duration-300 hover:shadow-md cursor-pointer shrink-0"
                >
                  <Stars count={t.rating} />
                  <p className="font-jakarta text-sm leading-relaxed tracking-tight text-black-100 mt-2 mb-2">
                    {t.text}
                  </p>
                  <span className="text-black-40 text-xs italic tracking-tight">
                    - {t.author}, {t.date}
                  </span>
                </div>
              ))}
              {textItems.map((t, i) => (
                <div
                  key={`dup-${i}`}
                  className="bg-white rounded-xl px-5 py-5 border border-separator-90 hover:border-gold-100 transition-all duration-300 hover:shadow-md cursor-pointer shrink-0"
                >
                  <Stars count={t.rating} />
                  <p className="font-jakarta text-sm leading-relaxed tracking-tight text-black-100 mt-2 mb-2">
                    {t.text}
                  </p>
                  <span className="text-black-40 text-xs italic tracking-tight">
                    - {t.author}, {t.date}
                  </span>
                </div>
              ))}
            </div>

            <style>{`
              @keyframes marquee-vertical {
                0% { transform: translateY(0); }
                100% { transform: translateY(-50%); }
              }
              .animate-marquee-vertical {
                animation: marquee-vertical 25s linear infinite;
              }
              .animate-marquee-vertical:hover {
                animation-play-state: paused;
              }
            `}</style>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
