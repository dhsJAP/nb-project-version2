create table if not exists public.service_items (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  name text not null,
  description text,
  duration_minutes integer,
  price numeric(10,2),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists service_items_service_id_idx
  on public.service_items(service_id);

create index if not exists service_items_sort_order_idx
  on public.service_items(sort_order);

insert into public.service_items (service_id, name, description, duration_minutes, price, sort_order)
select s.id, v.name, v.description, v.duration_minutes, v.price, v.sort_order
from public.services s
join (
  values
    ('Manicures', 'Classic Manicure', 'Nail trim, shape, cuticle care, regular polish.', 30, 25, 1),
    ('Manicures', 'Gel Manicure', 'Long-lasting gel polish with glossy finish.', 45, 40, 2),
    ('Manicures', 'Spa Manicure', 'Classic manicure plus scrub and hand massage.', 50, 48, 3),
    ('Pedicures', 'Classic Pedicure', 'Foot soak, nail care, and regular polish.', 40, 35, 1),
    ('Pedicures', 'Deluxe Pedicure', 'Extended exfoliation, massage, and premium finish.', 55, 50, 2),
    ('Pedicures', 'Gel Pedicure', 'Pedicure with durable gel polish.', 55, 52, 3),
    ('Organic Dipping - SNS', 'SNS Full Set', 'Organic dipping powder full application.', 60, 55, 1),
    ('Organic Dipping - SNS', 'SNS Refill', 'Dipping powder refill and rebalance.', 50, 45, 2),
    ('Organic Dipping - SNS', 'SNS Ombre', 'Two-tone ombre finish with SNS.', 70, 65, 3),
    ('Acrylic', 'Builder Gel/Hot Gel Fulset', null, 60, null, 1),
    ('Acrylic', 'Builder Gel Fill', null, 60, null, 2),
    ('Acrylic', 'P&W Full Set', null, 60, null, 3),
    ('Acrylic', 'P & W Fill in', null, 60, null, 4),
    ('Acrylic', 'Pink Fill in', null, 60, null, 5),
    ('Acrylic', 'Acrylic Full Set', null, 60, null, 6),
    ('Acrylic', 'Full Set Gel', null, 60, null, 7),
    ('Acrylic', 'Acrylic Fill in', null, 60, null, 8),
    ('Acrylic', 'Fill in Gel', null, 60, null, 9),
    ('Acrylic', 'Ombre Full Set', null, 65, null, 10),
    ('Acrylic', 'Extra Services', null, 0, null, 11),
    ('Acrylic', 'Coffin/Stiletto/Almond', null, 5, null, 12),
    ('Acrylic', 'Long Nails', null, 5, null, 13),
    ('Acrylic', 'Nail Art', null, 10, null, 14),
    ('Acrylic', 'Nail Repair', null, 0, null, 15),
    ('Waxing', 'Eyebrow Wax', 'Quick brow shaping and cleanup.', 15, 12, 1),
    ('Waxing', 'Upper Lip Wax', 'Gentle upper lip hair removal.', 10, 8, 2),
    ('Waxing', 'Full Face Wax', 'Comprehensive face waxing service.', 30, 30, 3),
    ('Kid Service', 'Kids Manicure', 'Safe and simple manicure for children.', 20, 15, 1),
    ('Kid Service', 'Kids Pedicure', 'Kid-friendly pedicure with gentle care.', 25, 18, 2),
    ('Kid Service', 'Kids Mani-Pedi', 'Combined manicure and pedicure for kids.', 40, 30, 3),
    ('Gift Card', 'Gift Card $50', 'Gift value redeemable for any service.', 5, 50, 1),
    ('Gift Card', 'Gift Card $100', 'Gift value redeemable for any service.', 5, 100, 2),
    ('Gift Card', 'Custom Gift Card', 'Choose your preferred gift value.', 5, null, 3),
    ('Additional Service', 'Nail Art (Basic)', 'Simple line art and accent details.', 15, 10, 1),
    ('Additional Service', 'Chrome / Cat Eye', 'Special effect finish add-on.', 20, 15, 2),
    ('Additional Service', 'Nail Repair', 'Single nail repair and reinforcement.', 10, 7, 3)
) as v(service_name, name, description, duration_minutes, price, sort_order)
  on s.name = v.service_name
where not exists (
  select 1
  from public.service_items si
  where si.service_id = s.id
    and lower(si.name) = lower(v.name)
);
