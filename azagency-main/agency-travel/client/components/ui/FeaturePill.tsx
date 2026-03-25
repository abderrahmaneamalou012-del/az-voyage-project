export interface FeaturePillProps {
    
    text: string;
    
    image: string;
}

const FeaturePill = ({ text, image }: FeaturePillProps) => {
    return (
        <div className="flex items-center gap-3 flex-shrink-0 px-4 py-2.5 cursor-pointer hover:shadow-md transition-all duration-300">
            <img
                src={image}
                alt={text}
                className="w-10 h-10 object-contain flex-shrink-0"
            />
            <span className="text-black-60 font-medium text-base tracking-tight whitespace-nowrap">
                {text}
            </span>
        </div>
    );
};

export default FeaturePill;
