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


export interface BookingState {
  service:     Service | null
  date:        string | null   // 'YYYY-MM-DD'
  time:        string | null   // 'HH:MM'
  paymentMode: 'deposit' | 'full'
  name:        string
  email:       string
  phone:       string
  cardNumber:  string
  cardExpiry:  string
  cardCvc:     string
  cardName:    string
  notes:       string
}