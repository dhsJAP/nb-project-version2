import { Service } from "@/type";

export function ServiceCard({ service }: { service: Service }) {
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
          ⏱ {service.duration_minutes} minutes
        </span>
        <span
          className="text-2xl text-rose-600"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
        >
          ${service.price}
        </span>
      </div>
    </div>
  )
}