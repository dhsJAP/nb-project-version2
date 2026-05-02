"use client";

import Image from 'next/image'
import { StaffMember } from '@/type'



export function StaffSection({ staff }: { staff: StaffMember[] }) {
  return (
    
    <section className="py-24 bg-[#fdf8f5]">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[4px] text-rose-400 uppercase mb-3">Our Staff</p>
          <h2 className="text-4xl text-stone-800" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
            Meet Our Artists
          </h2>
        </div>
        <div className="grid grid-cols-5 gap-6">
          {staff.map((member) => (
            <article key={member.id} className="bg-white border border-rose-100 rounded-2xl p-4">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-rose-50 mb-4">
                <Image src={member.image_url || ""} alt={member.name} fill className="object-cover" />
              </div>
              <h3 className="text-lg text-stone-800" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                {member.name}
              </h3>
              <p className="text-sm text-stone-500 mt-1">{member.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

