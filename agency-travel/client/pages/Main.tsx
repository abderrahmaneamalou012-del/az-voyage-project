import BannerNav from "../components/ui/BannerNav";
import PhotoGallery, { SubGrid } from "../components/sections/PhotoGallery";
import PhotoScroll from "../components/sections/PhotoScroll";
import Footer from "../components/sections/Footer";
import { Plane } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
    resolveGalleryImage,
    resolveGallerySlotImages,
    useGalleryPage,
} from "@/hooks/useGalleryPage";

const navLinks = [
  { label: "Nos offres", href: "/listing" },
    { label: "Destinations", href: "/#destinations" },
    { label: "Témoignages", href: "/#temoignages" },
    { label: "FAQ", href: "/#faq" },
    { label: "Gallerie", href: "/gallerie" },
];

const malaisieSlotKeys = [
    "block01",
    "block02",
    "block03",
    "block04",
    "block05",
    "block06",
    "block07",
    "block08",
    "block09",
];

const indonesieSlotKeys = [
    "slide01",
    "slide02",
    "slide03",
    "slide04",
    "slide05",
];

const zanzibarSlotKeys = [
    "block01",
    "block02",
    "block03",
    "block04",
    "block05",
    "block06",
    "block07",
    "block08",
    "block09",
];


const malaisieDiv: SubGrid[] = [
    {
        columns: "2fr 3fr 1fr",
        rows: "140px 140px 140px",
        items: [
            { col: "1", row: "1 / 3" },
            { col: "2", row: "1 / 4" },
            { col: "3", row: "1 / 3" },
            { col: "1", row: "3" },
            { col: "3", row: "3" },
        ],
    },
    {
        columns: "2fr 1fr 1fr",
        rows: "140px 140px",
        items: [
            { col: "1", row: "1 / 3" },
            { col: "2", row: "1" },
            { col: "3", row: "1 / 3" },
            { col: "2", row: "2" },
        ],
    },
];

const malaisieImages = [
    { src: "/assets/figma/5a02729a3418047c872b3399e3fcaaa7fd8876e1.jpg", alt: "Food by the pool" },
    { src: "/assets/figma/cf0410856b991c188fcf3b7f24a87b6fed7eb6e8.jpg", alt: "ATV adventure" },
    { src: "/assets/figma/7d83481de93cb3515133271899e0d62e56c401e5.jpg", alt: "Beach resort" },
    { src: "/assets/figma/47915728ec2c232de145d04fe195c0cf46027056.jpg", alt: "City skyline" },
    { src: "/assets/figma/e34c3efe581f3c46ab4d29d681117654609f65b9.jpg", alt: "Beach path" },
    { src: "/assets/figma/37c823577edb4dbdc73e687407625fd87908430a.jpg", alt: "Sunset pool" },
    { src: "/assets/figma/41f508fbba5d9a76394c60f6d497d92a6820690a.jpg", alt: "City street" },
    { src: "/assets/figma/59963752338377140a89306e9be22526a08262a9.jpg", alt: "Jungle trail" },
    { src: "/assets/figma/910cc56e7171f85753f9a3f9629a2e27c588c472.jpg", alt: "Kayaking" },
];


const zanzibarDiv: SubGrid[] = [
    {
        columns: "1fr 1fr 1fr",
        rows: "140px 140px 140px 140px 140px",
        items: [
            { col: "1", row: "1 / 3" },
            { col: "2", row: "1" },
            { col: "3", row: "1 / 3" },
            { col: "2", row: "2 / 4" },
            { col: "1", row: "3 / 5" },
            { col: "3", row: "3 / 5" },
            { col: "2", row: "4 / 6" },
            { col: "1", row: "5" },
            { col: "3", row: "5" },
        ],
    },
];

const zanzibarImages = [
    { src: "/assets/figma/37c823577edb4dbdc73e687407625fd87908430a.jpg", alt: "Pool" },
    { src: "/assets/figma/d1d2e746586963a4fd04eb564c23aa979fa68946.jpg", alt: "Beach" },
    { src: "/assets/figma/7d83481de93cb3515133271899e0d62e56c401e5.jpg", alt: "Resort" },
    { src: "/assets/figma/b4365b4213a1ab3ed63291bf2cf4d1f00b6c6c4e.jpg", alt: "Tropical pool" },
    { src: "/assets/figma/47915728ec2c232de145d04fe195c0cf46027056.jpg", alt: "City tower" },
    { src: "/assets/figma/910cc56e7171f85753f9a3f9629a2e27c588c472.jpg", alt: "Night resort" },
    { src: "/assets/figma/59963752338377140a89306e9be22526a08262a9.jpg", alt: "Boat" },
    { src: "/assets/figma/41f508fbba5d9a76394c60f6d497d92a6820690a.jpg", alt: "Skyline" },
    { src: "/assets/figma/e34c3efe581f3c46ab4d29d681117654609f65b9.jpg", alt: "Trees" },
];

const indonesieImages = [
    { src: "/assets/figma/37c823577edb4dbdc73e687407625fd87908430a.jpg", alt: "Night view" },
    { src: "/assets/figma/47915728ec2c232de145d04fe195c0cf46027056.jpg", alt: "City lights" },
    { src: "/assets/figma/41f508fbba5d9a76394c60f6d497d92a6820690a.jpg", alt: "Street" },
    { src: "/assets/figma/b4365b4213a1ab3ed63291bf2cf4d1f00b6c6c4e.jpg", alt: "Beach" },
    { src: "/assets/figma/d1d2e746586963a4fd04eb564c23aa979fa68946.jpg", alt: "Pool sunset" },
];

const fallbackHeroBackground = {
    src: "/assets/figma/e34c3efe581f3c46ab4d29d681117654609f65b9.jpg",
    alt: "Banniere galerie",
};

const cmsMissingSlotFallback = (label: string) => ({
    src: "/assets/figma/logo.png",
    alt: label,
});

export default function Main() {
    const { data: galleryPage } = useGalleryPage();

    usePageMeta({
        title: "Galerie photos",
        description: "Explorez notre galerie de photos de destinations : Malaisie, Turquie, Dubaï et plus encore.",
    });

    const heroBackground = resolveGalleryImage(
        galleryPage?.hero?.background,
        fallbackHeroBackground,
    );

    const malaisieFallbackSet = galleryPage
        ? malaisieSlotKeys.map((slotKey, index) =>
            cmsMissingSlotFallback(`Malaisie ${index + 1} (${slotKey})`),
        )
        : malaisieImages;

    const indonesieFallbackSet = galleryPage
        ? indonesieSlotKeys.map((slotKey, index) =>
            cmsMissingSlotFallback(`Indonesie ${index + 1} (${slotKey})`),
        )
        : indonesieImages;

    const zanzibarFallbackSet = galleryPage
        ? zanzibarSlotKeys.map((slotKey, index) =>
            cmsMissingSlotFallback(`Zanzibar ${index + 1} (${slotKey})`),
        )
        : zanzibarImages;

    const resolvedMalaisieImages = resolveGallerySlotImages(
        galleryPage?.malaisie,
        malaisieSlotKeys,
        malaisieFallbackSet,
    );
    const resolvedIndonesieImages = resolveGallerySlotImages(
        galleryPage?.indonesie,
        indonesieSlotKeys,
        indonesieFallbackSet,
    );
    const resolvedZanzibarImages = resolveGallerySlotImages(
        galleryPage?.zanzibar,
        zanzibarSlotKeys,
        zanzibarFallbackSet,
    );

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
            <div className="w-[95%] mt-4 mx-auto">
                <BannerNav
                    bgImage={heroBackground.src}
                    navLinks={navLinks}
                >
                    <h1 className="font-jakarta font-extrabold text-[36px] sm:text-[48px] tracking-[-2px] leading-tight text-white mb-4">
                        Souvenirs de voyage avec{" "}
                        <span className="text-gold-100 italic">AZ Voyage</span>
                    </h1>
                    <p className="text-white/70 text-base sm:text-lg leading-relaxed tracking-tight max-w-[520px]">
                        Des départs réels, des expériences authentiques, et des souvenirs
                        partagés par nos voyageurs.
                    </p>
                </BannerNav>
            </div>

            
            <PhotoGallery division={malaisieDiv} images={resolvedMalaisieImages}>
                <h2 className="font-jakarta font-bold text-[28px] sm:text-[36px] tracking-[-1.5px]">
                    <span className="text-gold-100" style={{ fontFamily: "'Caveat', cursive" }}>Malaisie,</span>
                    <span className="text-black-100"> nature et dépaysement</span>
                </h2>
            </PhotoGallery>

            
            <PhotoScroll
                titleHighlight="Indonésie"
                titleHighlightColor="#0030DF"
                titleRest="un voyage au bout du monde"
                images={resolvedIndonesieImages}
            />

            
            <PhotoGallery division={zanzibarDiv} images={resolvedZanzibarImages}>
                <h2 className="font-jakarta font-bold text-[28px] sm:text-[36px] tracking-[-1.5px]">
                    <span style={{ fontFamily: "'Caveat', cursive", color: "#059900" }}>Zanzibar,</span>
                    <span className="text-black-100"> l'évasion parfaite</span>
                </h2>
            </PhotoGallery>

            <Footer />
        </div >
    );
}
