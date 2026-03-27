import { Send } from "lucide-react";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}

const SuccessModal = ({ open, onClose }: SuccessModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 flex flex-col items-center text-center animate-fade-up">
        
        <div className="w-20 h-20 rounded-full bg-navy-10/40 flex items-center justify-center mb-6">
          <Send className="w-9 h-9 text-navy-40 -rotate-12" />
        </div>

        <h2 className="font-jakarta font-bold text-[22px] tracking-[-0.8px] text-black-100 mb-3">
          Demande envoyée avec succès !
        </h2>

        <p className="text-black-50 text-sm leading-relaxed tracking-tight mb-8 max-w-[340px]">
          Notre équipe vérifie les disponibilités selon vos dates et vous
          contactera rapidement avec une proposition adaptée.
        </p>

        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onClose();
            window.location.href = "/";
          }}
          className="w-full bg-navy-100 text-white py-3.5 rounded-full font-medium text-[15px] tracking-tight hover:bg-navy-90 transition-all duration-300 hover:shadow-lg text-center"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
};

export default SuccessModal;
