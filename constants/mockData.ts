import { Review, Service } from "@/type";

export const FALLBACK_SERVICES: Service[] = [
  { id: '1', name: 'Gel Manicure',    description: 'Nail shaping, cuticle care, and gel polish that lasts up to 3 weeks.', duration_minutes: 45, price: 45 },
  { id: '2', name: 'Nail Art Design', description: 'Unique artistic designs, custom patterns based on your preferences.',      duration_minutes: 60, price: 65 },
  { id: '3', name: 'Deluxe Pedicure', description: 'Foot soak, exfoliation, massage, and premium gel polish.',      duration_minutes: 50, price: 55 },
  { id: '4', name: 'Full Set Acrylic',description: 'Complete acrylic application, shaping, and artistic detailing.', duration_minutes: 75, price: 80 },
]

export const FALLBACK_REVIEWS: Review[] = [
  { id: '1', author: 'Bruce Wayne', rating: 5, body: 'Trinh\'s manicures are very meticulous and professional. The gel nails lasted over 3 weeks, and the color still looks as good as new. I will definitely come back!', created_at: '2025-03-01' },
  { id: '2', author: 'Cristiano Ronaldo',      rating: 5, body: 'Trinh\'s nail art is beautiful and exceeds expectations!',created_at: '2025-02-15' },
  { id: '3', author: 'Leo Messi',   rating: 5, body: 'Easy booking through the website, and the service is excellent. Highly recommended!', created_at: '2025-01-20' },
]