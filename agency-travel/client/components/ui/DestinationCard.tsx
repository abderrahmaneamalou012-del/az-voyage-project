import { ArrowRight } from "lucide-react";

export interface DestinationCardProps {
    
    src: string;
    
    alt?: string;
    
    title: string;
    
    description?: string;
    
    tags?: string[];
    
    href?: string;
}

const DestinationCard = ({
    src,
    alt = "",
    title,
    description,
    tags = [],
    href,
}: DestinationCardProps) => {
    const featheredBlackOverlay = {
        backgroundColor: "#000000",
        WebkitMaskImage:
            "linear-gradient(to top, #000 0%, #000 18%, rgba(0,0,0,0.96) 34%, rgba(0,0,0,0.78) 54%, rgba(0,0,0,0.46) 76%, rgba(0,0,0,0.18) 91%, transparent 100%)",
        maskImage:
            "linear-gradient(to top, #000 0%, #000 18%, rgba(0,0,0,0.96) 34%, rgba(0,0,0,0.78) 54%, rgba(0,0,0,0.46) 76%, rgba(0,0,0,0.18) 91%, transparent 100%)",
    } as const;

    const content = (
        <div className="relative rounded-2xl overflow-hidden aspect-square group cursor-pointer">
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
            />
            <div
                className="absolute inset-x-0 bottom-0 h-[56%] pointer-events-none"
                style={featheredBlackOverlay}
            />

            <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
                <h3 className="text-white font-jakarta font-semibold text-[30px] leading-none tracking-[-1.2px] drop-shadow-lg mb-2">
                    {title}
                </h3>
                {description && (
                    <p className="text-white/90 text-sm leading-relaxed tracking-tight mb-4 line-clamp-3">
                        {description}
                    </p>
                )}

                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        {tags.slice(0, 2).map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium tracking-tight backdrop-blur-sm border border-white/25"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <span className="w-9 h-9 rounded-full bg-white/20 border border-white/30 text-white flex items-center justify-center backdrop-blur-sm group-hover:bg-white group-hover:text-navy-100 transition-colors duration-300">
                        <ArrowRight className="w-4 h-4" />
                    </span>
                </div>
            </div>
        </div>
    );

    if (href) {
        return (
            <a href={href} className="block">
                {content}
            </a>
        );
    }

    return content;
};

export default DestinationCard;
