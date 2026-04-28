import Link from "next/link";
import { ServiceCard } from "./ServiceCard";
import { ServicesProps } from "@/type";


export function Services({ services, serviceItemsByServiceId }: ServicesProps) {
  return (
        <section id="services" className="py-20 bg-[#fdf8f5]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[4px] text-rose-400 uppercase mb-3">Services</p>
            <h2
              className="text-4xl text-stone-800"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
            >
              Price List
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((s) => (
              <ServiceCard
                key={s.id}
                service={s}
                items={serviceItemsByServiceId[s.id] ?? []}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/booking"
              className="inline-block bg-rose-500 hover:bg-rose-600 text-white px-10 py-3.5 rounded-full font-medium transition-all hover:scale-[1.02] text-sm"
            >
              Book now
            </Link>
          </div>
        </div>
      </section>
    );
}
