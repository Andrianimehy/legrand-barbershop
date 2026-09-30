import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-[#111111] border border-gray-800 overflow-hidden hover:border-amber-600 transition-colors group">
      {service.image_url && (
        <div className="w-full h-48 overflow-hidden bg-[#0a0a0a]">
          <img
            src={service.image_url}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-5">
        <h4 className="text-white font-semibold text-sm mb-2">{service.name}</h4>
        {service.description && (
          <p className="text-gray-500 text-xs mb-3 line-clamp-2">{service.description}</p>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-gray-900">
          {service.duration && (
            <span className="text-gray-600 text-xs">{service.duration}</span>
          )}
          <span className="text-amber-400 font-bold text-sm">{service.price.toLocaleString()} Ar</span>
        </div>
      </div>
    </div>
  );
}
