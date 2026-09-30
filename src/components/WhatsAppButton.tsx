import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  position?: 'bottom-right' | 'bottom-left';
}

export default function WhatsAppButton({
  phoneNumber = '+261341458773',
  message = 'Bonjour! Je souhaiterais en savoir plus sur vos services.',
  position = 'bottom-right',
}: WhatsAppButtonProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

  const positionClasses = position === 'bottom-right'
    ? 'right-6 top-1/2 -translate-y-1/2'
    : 'left-6 top-1/2 -translate-y-1/2';

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed ${positionClasses} z-40 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group animate-pulse hover:animate-none`}
      aria-label="Contactez-nous sur WhatsApp"
      title="Contactez-nous sur WhatsApp"
    >
      <MessageCircle size={24} className="text-white" />
      <span className="absolute right-full mr-3 bg-green-600 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Message WhatsApp
      </span>
    </a>
  );
}
