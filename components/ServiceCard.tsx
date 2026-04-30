"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Service, ServiceItem } from "@/type";

export function ServiceCard({
  service,
  items,
  isDetailsOpen,
  onToggleDetails,
}: {
  service: Service
  items: ServiceItem[]
  isDetailsOpen: boolean
  onToggleDetails: () => void
}) {
  const [openUpward, setOpenUpward] = useState(false)

  const updatePanelDirection = useCallback((el: HTMLDivElement | null) => {
    if (!el) return
    const rect = el.getBoundingClientRect()
    const estimatedPanelHeight = 260
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    setOpenUpward(spaceBelow < estimatedPanelHeight && spaceAbove > spaceBelow)
  }, [])

  return (
    <div
      tabIndex={0}
      role={items.length > 0 ? "button" : undefined}
      aria-expanded={items.length > 0 ? isDetailsOpen : undefined}
      className="group relative bg-white border border-rose-100 rounded-2xl p-6 hover:border-rose-300 hover:shadow-lg focus:outline-none focus:border-rose-300 focus:shadow-lg transition-all duration-300"
      ref={updatePanelDirection}
      onMouseEnter={(e) => updatePanelDirection(e.currentTarget)}
      onFocus={(e) => updatePanelDirection(e.currentTarget)}
      onClick={() => {
        if (items.length === 0) return
        onToggleDetails()
      }}
      onKeyDown={(e) => {
        if (items.length === 0) return
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onToggleDetails()
        }
      }}
    >
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl">
        <div className={`absolute top-2 right-2 w-8 h-8 rounded-full transition-colors ${isDetailsOpen ? "bg-rose-100" : "bg-rose-50"}`} />
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
        <p className="mt-3 text-[11px] tracking-[1.5px] uppercase text-rose-400">
          click for details
        </p>
      )}

      {items.length > 0 && (
        <div
          className={`absolute left-4 right-4 z-20 transition-all duration-200 ${
            isDetailsOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          } ${
            openUpward
              ? `bottom-[calc(100%-8px)] ${isDetailsOpen ? "translate-y-0" : "translate-y-1"}`
              : `top-[calc(100%-8px)] ${isDetailsOpen ? "translate-y-0" : "translate-y-1"}`
          }`}
        >
          <div className="rounded-xl border border-rose-100 bg-white shadow-xl p-3">
            <p className="text-[10px] tracking-[2px] uppercase text-rose-400 mb-2">
              Service Details
            </p>
            <ul className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {items.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3">
                  <Link
                    href={`/booking?serviceId=${service.id}&itemId=${item.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full flex items-start justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-rose-50 transition-colors"
                  >
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
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
