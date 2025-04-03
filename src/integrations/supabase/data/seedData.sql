
-- Insert additional categories
INSERT INTO public.categories (name, description) VALUES
('Luxury Panels', 'Premium decorative wall panels'),
('Designer Collection', 'Exclusive designer patterns'),
('Modern Series', 'Contemporary design solutions');

-- Insert additional products
INSERT INTO public.products (title, description, price, category_id, status, image_url) 
SELECT 
  'Diamond Series Panel',
  'Luxurious diamond-patterned wall panel with metallic finish',
  2499.99,
  id,
  'active',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6'
FROM public.categories 
WHERE name = 'Luxury Panels'
LIMIT 1;

INSERT INTO public.products (title, description, price, category_id, status, image_url)
SELECT 
  'Gold Leaf Collection',
  'Premium gold leaf laminate for luxury interiors',
  1899.99,
  id,
  'active',
  'https://images.unsplash.com/photo-1615873968403-89e068629265'
FROM public.categories 
WHERE name = 'Designer Collection'
LIMIT 1;

-- Insert additional brochures
INSERT INTO public.brochures (title, description, file_url, file_type, file_size) VALUES
('Luxury Collection 2024', 'Exclusive luxury interior solutions', '/brochures/luxury-2024.pdf', 'PDF', '3.2 MB'),
('Designer Guide 2024', 'Premium design inspiration catalog', '/brochures/designer-guide-2024.pdf', 'PDF', '4.1 MB'),
('Technical Specifications', 'Detailed product specifications', '/brochures/tech-specs-2024.pdf', 'PDF', '2.8 MB');
