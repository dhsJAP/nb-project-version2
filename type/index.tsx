export interface Service {
  id: string
  name: string
  description: string
  duration_minutes: number
  price: number
}

export interface Review {
  id: string
  author: string
  rating: number
  body: string
  created_at: string
}

export interface ServicesProps {
  services: Service[]
}

export interface ReviewCardProps {
  review: Review
}

