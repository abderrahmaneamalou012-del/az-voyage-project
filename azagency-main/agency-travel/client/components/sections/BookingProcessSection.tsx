import { Plane } from "lucide-react";
import {
    useFeatures,
    useBookingProcessContent,
    useBookingSteps,
    getFeatureImageSrc,
} from "@/hooks/useFeatures";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { resolveImageUrl } from "@/lib/payload";


const fallbackFeatures = [
    { id: "1", text: "Hôtel", imageUrl: "/assets/figma/taj-garden.png" },
    { id: "2", text: "Transferts", imageUrl: "/assets/figma/airport.png" },
    { id: "3", text: "Hôtels au choix", imageUrl: "/assets/figma/petra-canyon.png" },
    { id: "4", text: "Départs disponibles", imageUrl: "/assets/figma/cappadocia.png" },
    { id: "5", text: "Assistance", imageUrl: "/assets/figma/island.png" },
    { id: "6", text: "Lune de miel", imageUrl: "/assets/figma/colosseum-garden.png" },
    { id: "7", text: "Musées", imageUrl: "/assets/figma/pyramids-oasis.png" },
];

const fallbackSteps = [
    { num: "01.", title: "Choisissez votre destination", description: "Parcourez nos offres, comparez les dates et les options d'hôtel, puis sélectionnez la formule qui vous convient le mieux." },
    { num: "02.", title: "Envoyez votre demande", description: "Envoyez votre demande via le formulaire ou sur WhatsApp en indiquant le nombre de voyageurs et l'hôtel choisi." },
    { num: "03.", title: "Confirmation & préparation", description: "Nous confirmons la disponibilité, puis vous recevez les informations et les prochaines étapes pour finaliser." },
];

const decorativeImageSrc = "/assets/figma/footer%20picture%20.png";

const BookingProcessSection = () => {
    const { data: cmsFeatures } = useFeatures();
    const { data: cmsBookingProcessContent } = useBookingProcessContent();
    const { data: cmsSteps } = useBookingSteps();

    const features = (cmsFeatures?.length ? cmsFeatures : fallbackFeatures).map((f) => ({
        text: f.text,
        image: getFeatureImageSrc(f),
    }));

    const configuredBlocks = [
        cmsBookingProcessContent?.block1,
        cmsBookingProcessContent?.block2,
        cmsBookingProcessContent?.block3,
    ];

    const steps = [0, 1, 2].map((index) => {
        const fallbackStep = cmsSteps?.[index] ?? fallbackSteps[index];
        const configuredBlock = configuredBlocks[index];
        return {
            num: fallbackSteps[index].num,
            title: configuredBlock?.title?.trim() || fallbackStep.title,
            desc: configuredBlock?.description?.trim() || fallbackStep.description,
        };
    });

    const photoSlides = (cmsBookingProcessContent?.photoSlides ?? [])
        .map((slide, index) => {
            const src = resolveImageUrl(slide.image, slide.imageUrl);

            if (!src) return null;

            return {
                src,
                alt:
                    typeof slide.image === "object" && slide.image?.alt
                        ? slide.image.alt
                        : `De la réservation au décollage ${index + 1}`,
            };
        })
        .filter((slide): slide is { src: string; alt: string } => Boolean(slide));

    const showPhotoCarousel =
        cmsBookingProcessContent?.layoutMode === "photos" && photoSlides.length > 0;

    const tickerItems = [...features, ...features, ...features];

    return (
        <section className="bg-white py-20 overflow-hidden">
            <div className="px-6 sm:px-10 lg:px-16">
                <h2 className="font-jakarta font-bold text-[34px] sm:text-[46px] tracking-[-2.2px] text-center mb-12 leading-[1.08]">
                    <span className="text-black-100">De la </span>
                    <span className="text-gold-100">réservation au décollage</span>
                </h2>
            </div>

            <div className="relative overflow-hidden border-y border-separator-90 bg-white py-7 sm:py-9">
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                <div className="flex w-max items-center gap-10 sm:gap-14 animate-booking-process-marquee">
                    {tickerItems.map((feature, index) => (
                        <div key={`${feature.text}-${index}`} className="flex shrink-0 items-center gap-4">
                            <img
                                src={feature.image}
                                alt={feature.text}
                                className="h-8 w-auto object-contain sm:h-10"
                            />
                            <span className="font-jakarta text-[18px] sm:text-[20px] font-medium tracking-[-0.8px] text-black-50 whitespace-nowrap">
                                {feature.text}
                            </span>
                        </div>
                    ))}
                </div>

                <style>{`
                    @keyframes bookingProcessMarquee {
                        from { transform: translateX(0); }
                        to { transform: translateX(-33.333%); }
                    }
                    .animate-booking-process-marquee {
                        animation: bookingProcessMarquee 28s linear infinite;
                    }
                    .animate-booking-process-marquee:hover {
                        animation-play-state: paused;
                    }
                `}</style>
            </div>

            <div className="border-b border-separator-90 bg-white lg:flex">
                <div className="flex flex-col items-center justify-center gap-10 border-b border-separator-90 bg-[#E7EBEC] px-6 py-10 text-center sm:px-10 sm:py-12 lg:w-[368px] lg:flex-shrink-0 lg:border-b-0 lg:border-r lg:px-9">
                    <div className="max-w-[260px]">
                        <h3 className="font-jakarta font-bold text-[34px] leading-[1.04] tracking-[-1.6px] text-black-100 mb-5">
                            De l'idée au décollage
                        </h3>
                        <p className="text-black-50 text-[18px] leading-[1.65] tracking-[-0.6px]">
                            Un voyage bien organisé commence par une réservation claire. Choisissez votre offre, envoyez votre demande, puis recevez une confirmation avec tous les détails. On vous accompagne jusqu'au départ.
                        </p>
                    </div>
                    <a
                        href="#offres"
                        className="inline-flex items-center justify-center rounded-full bg-navy-100 px-8 py-3.5 font-medium text-[18px] tracking-[-0.6px] text-white transition-all duration-300 hover:bg-navy-90 hover:shadow-lg hover:-translate-y-0.5"
                    >
                        Réserver une offre
                    </a>
                </div>

                <div className="flex-1">
                    {showPhotoCarousel ? (
                        <div className="px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
                            <Carousel
                                opts={{ align: "start" }}
                                className="w-full"
                            >
                                <CarouselContent className="-ml-3 md:-ml-4">
                                    {photoSlides.map((slide, index) => (
                                        <CarouselItem
                                            key={`${slide.src}-${index}`}
                                            className="basis-[82%] pl-3 sm:basis-1/2 md:pl-4 xl:basis-1/3"
                                        >
                                            <div className="overflow-hidden rounded-[28px] bg-[#E7EBEC] aspect-[9/16]">
                                                <img
                                                    src={slide.src}
                                                    alt={slide.alt}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>

                                <div className="mt-6 hidden items-center justify-end gap-3 lg:flex">
                                    <CarouselPrevious
                                        variant="outline"
                                        className="static h-11 w-11 translate-y-0 border-separator-90 bg-white text-black-100 hover:bg-[#F6F8F8]"
                                    />
                                    <CarouselNext
                                        variant="outline"
                                        className="static h-11 w-11 translate-y-0 border-separator-90 bg-white text-black-100 hover:bg-[#F6F8F8]"
                                    />
                                </div>
                            </Carousel>
                        </div>
                    ) : (
                        <>
                            <div className="border-b border-separator-90 px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
                                <span className="font-jakarta font-bold text-[58px] sm:text-[72px] leading-none tracking-[-3px] text-black-100">
                                    {steps[0].num}
                                </span>
                                <h4 className="mt-4 mb-4 font-jakarta font-bold text-[28px] sm:text-[30px] leading-[1.08] tracking-[-1.2px] text-black-100">
                                    {steps[0].title}
                                </h4>
                                <p className="max-w-[760px] text-black-50 text-[18px] sm:text-[20px] leading-[1.6] tracking-[-0.6px]">
                                    {steps[0].desc}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="border-b border-separator-90 px-6 py-10 sm:px-10 sm:py-12 md:border-b-0 md:border-r lg:px-12">
                                    <span className="font-jakarta font-bold text-[58px] sm:text-[72px] leading-none tracking-[-3px] text-black-100">
                                        {steps[1].num}
                                    </span>
                                    <h4 className="mt-4 mb-4 font-jakarta font-bold text-[28px] sm:text-[30px] leading-[1.08] tracking-[-1.2px] text-black-100">
                                        {steps[1].title}
                                    </h4>
                                    <p className="max-w-[520px] text-black-50 text-[18px] sm:text-[20px] leading-[1.6] tracking-[-0.6px]">
                                        {steps[1].desc}
                                    </p>
                                </div>

                                <div className="px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
                                    <span className="font-jakarta font-bold text-[58px] sm:text-[72px] leading-none tracking-[-3px] text-black-100">
                                        {steps[2].num}
                                    </span>
                                    <h4 className="mt-4 mb-4 font-jakarta font-bold text-[28px] sm:text-[30px] leading-[1.08] tracking-[-1.2px] text-black-100">
                                        {steps[2].title}
                                    </h4>
                                    <p className="max-w-[520px] text-black-50 text-[18px] sm:text-[20px] leading-[1.6] tracking-[-0.6px]">
                                        {steps[2].desc}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="bg-white px-6 pt-16 pb-16 sm:px-10 lg:px-16">
                <div className="relative overflow-hidden rounded-[28px] bg-navy-100 px-8 py-10 sm:px-10 sm:py-12 lg:px-12">
                    <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-[620px]">
                            <h3 className="font-jakarta font-bold text-[34px] sm:text-[42px] leading-[1.08] tracking-[-1.8px] text-white whitespace-nowrap">
                                Vous avez une destination en tête ?
                            </h3>
                            <p className="mt-4 max-w-[540px] text-[18px] sm:text-[20px] leading-[1.6] tracking-[-0.6px] text-[#D4E0E1]">
                                Dites-nous où vous voulez aller, on vous prépare une proposition adaptée à vos dates et votre budget.
                            </p>
                        </div>

                        <a
                            href="/voyage-sur-mesure"
                            className="inline-flex w-fit items-center gap-3 rounded-full bg-white px-7 py-4 font-medium text-[18px] tracking-[-0.6px] text-navy-100 transition-all duration-300 hover:bg-[#F6F8F8] hover:shadow-lg hover:-translate-y-0.5"
                        >
                            <Plane className="h-5 w-5" />
                            Demander un voyage sur mesure
                        </a>
                    </div>

                    <img
                        src={decorativeImageSrc}
                        alt=""
                        className="pointer-events-none absolute -right-10 -bottom-10 hidden xl:block w-[300px] opacity-25"
                    />
                </div>
            </div>
        </section>
    );
};

export default BookingProcessSection;
