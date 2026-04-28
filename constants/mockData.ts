import { Review, Service } from "@/type";

export const FALLBACK_SERVICES: Service[] = [
  { id: '1', name: 'Manicures',            description: 'Nail shaping, cuticle care, and polish for clean, elegant hands.',              duration_minutes: 45, price: 40 },
  { id: '2', name: 'Pedicures',             description: 'Foot soak, exfoliation, and polish for refreshed and polished feet.',           duration_minutes: 50, price: 45 },
  { id: '3', name: 'Organic Dipping - SNS', description: 'Healthy dipping powder system with strong, natural-looking finish.',            duration_minutes: 60, price: 55 },
  { id: '4', name: 'Acrylic',               description: 'Acrylic full set or refill with custom shape and durable wear.',                duration_minutes: 75, price: 65 },
  { id: '5', name: 'Waxing',                description: 'Gentle hair removal service for smooth skin and clean contours.',               duration_minutes: 30, price: 25 },
  { id: '6', name: 'Kid Service',           description: 'Age-friendly mini manicure and pedicure tailored for kids.',                    duration_minutes: 25, price: 20 },
  { id: '7', name: 'Gift Card',             description: 'Flexible gift card options for any service and any special occasion.',          duration_minutes: 10, price: 50 },
  { id: '8', name: 'Additional Service',    description: 'Add-ons such as nail art, chrome, rhinestones, repair, and extra care.',      duration_minutes: 20, price: 15 },
]

export const FALLBACK_REVIEWS: Review[] = [
  { id: '1', author: 'Bruce Wayne', rating: 5, body: 'Trinh\'s manicures are very meticulous and professional. The gel nails lasted over 3 weeks, and the color still looks as good as new. I will definitely come back!', created_at: '2025-03-01' },
  { id: '2', author: 'Cristiano Ronaldo',      rating: 5, body: 'Trinh\'s nail art is beautiful and exceeds expectations!',created_at: '2025-02-15' },
  { id: '3', author: 'Leo Messi',   rating: 5, body: 'Easy booking through the website, and the service is excellent. Highly recommended!', created_at: '2025-01-20' },
]

