import { Service, ServiceItem } from "@/type";

export function ServiceCard({
  service,
  items,
}: {
  service: Service
  items: ServiceItem[]
}) {
  return (
    <div className="group relative bg-white border border-rose-100 rounded-2xl p-6 hover:border-rose-300 hover:shadow-lg transition-all duration-300">
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl">
        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-rose-50 group-hover:bg-rose-100 transition-colors" />
      </div>
      <h3
        className="text-xl mb-2 text-stone-800"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
      >
        {service.name}
      </h3>
      <p className="text-sm text-stone-500 leading-relaxed mb-5">
        {service.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-stone-400 tracking-wide">
          {service.duration_minutes} minutes
        </span>
        <span
          className="text-2xl text-rose-600"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
        >
          ${service.price}
        </span>
      </div>

      {items.length > 0 && (
        <div className="pointer-events-none absolute left-4 right-4 top-[calc(100%-8px)] z-20 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
          <div className="rounded-xl border border-rose-100 bg-white shadow-xl p-3 pointer-events-auto">
            <p className="text-[10px] tracking-[2px] uppercase text-rose-400 mb-2">
              Service Details
            </p>
            <ul className="space-y-2 max-h-56 overflow-auto pr-1">
              {items.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-stone-700 leading-tight">{item.name}</p>
                    {item.description && (
                      <p className="text-xs text-stone-400 mt-0.5 leading-snug">{item.description}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    {item.price !== null && (
                      <p className="text-sm text-rose-600 font-medium">${item.price}</p>
                    )}
                    {item.duration_minutes !== null && (
                      <p className="text-[11px] text-stone-400">{item.duration_minutes}m</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
