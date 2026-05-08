"use client";

import Image from 'next/image'
import { StaffMember } from '@/type'
import { motion } from 'framer-motion'



export function StaffSection({ staff }: { staff: StaffMember[] }) {
  return (
    
    <section id="staff" className="py-24 bg-[#fdf8f5]">
      <div className="max-w-6xl mx-auto px-5">
        
        <motion.div
          initial={{ opacity: 0, scale : 0.95 }}
          whileInView={{ opacity: 1, scale : 1 }}
          transition={{
            duration: 1.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-center mb-12"
        >
          <p className="text-xs tracking-[4px] text-rose-400 uppercase mb-3">Our Staff</p>
          <h2 className="text-4xl text-stone-800" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
            Meet Our Artists
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1],delay: 0.2}}
           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {staff.map((member) => (
            <article key={member.id} className="bg-white border border-rose-100 rounded-2xl p-3 hover:-translate-y-1 transition-all duration-300">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-rose-50 mb-3">
                <Image src={member.image_url || ""} alt={member.name} fill className="object-cover" />
              </div>
              <h3 className="text-lg text-stone-800 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                {member.name}
              </h3>
              <p className="text-sm text-stone-500 mt-1">{member.role}</p>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

