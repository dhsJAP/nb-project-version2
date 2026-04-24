import { Review, Service } from "@/type";

export const FALLBACK_SERVICES: Service[] = [
  { id: '1', name: 'Gel Manicure',    description: 'Tạo hình, chăm sóc cuticle, sơn gel bền màu đến 3 tuần.', duration_minutes: 45, price: 45 },
  { id: '2', name: 'Nail Art Design', description: 'Thiết kế nghệ thuật độc đáo, hoạ tiết theo yêu cầu.',      duration_minutes: 60, price: 65 },
  { id: '3', name: 'Deluxe Pedicure', description: 'Ngâm chân, tẩy da chết, massage và sơn gel cao cấp.',      duration_minutes: 50, price: 55 },
  { id: '4', name: 'Full Set Acrylic',description: 'Đắp bột acrylic toàn bộ, tạo hình và trang trí nghệ thuật.', duration_minutes: 75, price: 80 },
]

export const FALLBACK_REVIEWS: Review[] = [
  { id: '1', author: 'Nguyễn Minh Châu', rating: 5, body: 'Lani làm móng rất tỉ mỉ và chuyên nghiệp. Bộ gel giữ được hơn 3 tuần, màu vẫn đẹp như mới. Sẽ quay lại!', created_at: '2025-03-01' },
  { id: '2', author: 'Trần Thu Hà',      rating: 5, body: 'Không gian sạch sẽ, Lani rất thân thiện. Nail art đẹp hơn cả mong đợi!',                                    created_at: '2025-02-15' },
  { id: '3', author: 'Lê Phương Anh',   rating: 5, body: 'Đặt lịch dễ dàng qua web, đến đúng giờ là được phục vụ ngay. Siêu hài lòng.',                               created_at: '2025-01-20' },
]