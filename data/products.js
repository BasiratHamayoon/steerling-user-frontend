export const products = [
  {
    id: 1,
    name: 'Pro Racer GT',
    price: 299.99,
    category: 'Racing',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Professional racing steering wheel with paddle shifters',
    model: 'PR-GT2023',
    stockCount: 15,
    features: ['Carbon Fiber', 'LED Display', 'Quick Release']
  },
  {
    id: 2,
    name: 'Luxury Elite',
    price: 459.99,
    category: 'Luxury',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Premium leather steering wheel with wood accents',
    model: 'LE-2023',
    stockCount: 8,
    features: ['Genuine Leather', 'Wood Trim', 'Heated']
  },
  {
    id: 3,
    name: 'Sport Carbon',
    price: 349.99,
    category: 'Sports Car',
    inStock: false,
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Lightweight carbon fiber steering wheel',
    model: 'SC-2023',
    stockCount: 0,
    features: ['Carbon Fiber', 'Aluminum Spokes', 'Red Stitching']
  },
  {
    id: 4,
    name: 'SUV Commander',
    price: 389.99,
    category: 'SUV/Truck',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Heavy duty steering wheel for SUVs and trucks',
    model: 'SUV-CMD',
    stockCount: 12,
    features: ['Heavy Duty', 'Heated', 'Multi-function']
  },
  {
    id: 5,
    name: 'Classic Vintage',
    price: 429.99,
    category: 'Classic',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Vintage style steering wheel for classic cars',
    model: 'CV-2023',
    stockCount: 5,
    features: ['Wood Rim', 'Brone Horn', 'Vintage Style']
  },
  {
    id: 6,
    name: 'Gaming Pro',
    price: 199.99,
    category: 'Gaming',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Professional gaming steering wheel with force feedback',
    model: 'GP-2023',
    stockCount: 25,
    features: ['Force Feedback', '900° Rotation', 'Pedal Set']
  },
  {
    id: 7,
    name: 'Universal Fit',
    price: 159.99,
    category: 'Universal',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Universal fit steering wheel for most vehicles',
    model: 'UF-2023',
    stockCount: 42,
    features: ['Universal Fit', 'Easy Install', 'Durable']
  },
  {
    id: 8,
    name: 'Custom Pro',
    price: 599.99,
    category: 'Custom',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Fully customizable steering wheel',
    model: 'CP-2023',
    stockCount: 3,
    features: ['Fully Custom', 'Premium Materials', 'Handmade']
  },
  {
    id: 9,
    name: 'Carbon Pro Racer',
    price: 399.99,
    category: 'Racing',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Carbon fiber racing steering wheel with digital display',
    model: 'CPR-2023',
    stockCount: 7,
    features: ['Carbon Fiber', 'Digital Display', 'Quick Release']
  },
  {
    id: 10,
    name: 'Luxury Wood Elite',
    price: 529.99,
    category: 'Luxury',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Luxury wood and leather steering wheel',
    model: 'LWE-2023',
    stockCount: 4,
    features: ['Walnut Wood', 'Nappa Leather', 'Heated']
  },
  {
    id: 11,
    name: 'Sports Performance',
    price: 369.99,
    category: 'Sports Car',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Performance steering wheel for sports cars',
    model: 'SP-2023',
    stockCount: 18,
    features: ['Aluminum', 'Perforated Leather', 'Red Stitching']
  },
  {
    id: 12,
    name: 'Heavy Duty Truck',
    price: 419.99,
    category: 'SUV/Truck',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Heavy duty steering wheel for trucks and large vehicles',
    model: 'HDT-2023',
    stockCount: 9,
    features: ['Heavy Duty', 'Heated', 'Multifunction']
  },
  {
    id: 13,
    name: 'Vintage Classic',
    price: 489.99,
    category: 'Classic',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Classic vintage steering wheel restoration',
    model: 'VC-2023',
    stockCount: 3,
    features: ['Vintage Style', 'Wood Finish', 'Handcrafted']
  },
  {
    id: 14,
    name: 'Gaming Force Pro',
    price: 249.99,
    category: 'Gaming',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Professional gaming steering wheel with force feedback',
    model: 'GFP-2023',
    stockCount: 21,
    features: ['Force Feedback', '1080° Rotation', 'Sequential Shifter']
  },
  {
    id: 15,
    name: 'Universal Pro',
    price: 189.99,
    category: 'Universal',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Professional universal fit steering wheel',
    model: 'UP-2023',
    stockCount: 35,
    features: ['Universal Fit', 'Easy Install', 'Durable']
  },
  {
    id: 16,
    name: 'Custom Master',
    price: 699.99,
    category: 'Custom',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Masterfully crafted custom steering wheel',
    model: 'CM-2023',
    stockCount: 2,
    features: ['Fully Custom', 'Premium Materials', 'Handmade']
  },
  {
    id: 17,
    name: 'Racing Elite',
    price: 459.99,
    category: 'Racing',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Elite racing steering wheel with advanced features',
    model: 'RE-2023',
    stockCount: 6,
    features: ['Carbon Fiber', 'LED Display', 'Paddle Shifters']
  },
  {
    id: 18,
    name: 'Executive Luxury',
    price: 579.99,
    category: 'Luxury',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Executive class luxury steering wheel',
    model: 'EL-2023',
    stockCount: 5,
    features: ['Premium Leather', 'Wood Accents', 'Heated']
  },
  {
    id: 19,
    name: 'Sports GT',
    price: 389.99,
    category: 'Sports Car',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'GT sports steering wheel for performance cars',
    model: 'SGT-2023',
    stockCount: 14,
    features: ['Aluminum', 'Perforated Leather', 'Blue Stitching']
  },
  {
    id: 20,
    name: 'Off-Road Pro',
    price: 449.99,
    category: 'SUV/Truck',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Professional off-road steering wheel',
    model: 'ORP-2023',
    stockCount: 8,
    features: ['Heavy Duty', 'Heated', 'Water Resistant']
  },
  {
    id: 21,
    name: 'Retro Classic',
    price: 539.99,
    category: 'Classic',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Retro style classic steering wheel',
    model: 'RC-2023',
    stockCount: 2,
    features: ['Retro Design', 'Wood Finish', 'Handcrafted']
  },
  {
    id: 22,
    name: 'Sim Racing Pro',
    price: 299.99,
    category: 'Gaming',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Professional sim racing steering wheel',
    model: 'SRP-2023',
    stockCount: 19,
    features: ['Force Feedback', '900° Rotation', 'Clutch Pedal']
  },
  {
    id: 23,
    name: 'Universal Plus',
    price: 169.99,
    category: 'Universal',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Plus version universal steering wheel',
    model: 'UPLUS-2023',
    stockCount: 42,
    features: ['Universal Fit', 'Easy Install', 'Affordable']
  },
  {
    id: 24,
    name: 'Bespoke Custom',
    price: 799.99,
    category: 'Custom',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Bespoke custom steering wheel made to order',
    model: 'BC-2023',
    stockCount: 1,
    features: ['Bespoke Design', 'Premium Materials', 'Handcrafted']
  },
  {
    id: 25,
    name: 'Hyper Racing X1',
    price: 549.99,
    category: 'Racing',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Hyper racing steering wheel for professional racers',
    model: 'HR-X1-2023',
    stockCount: 4,
    features: ['Carbon Fiber', 'Digital Dash', 'Quick Release']
  },
  {
    id: 26,
    name: 'Ultimate Luxury',
    price: 689.99,
    category: 'Luxury',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Ultimate luxury steering wheel with premium materials',
    model: 'UL-2023',
    stockCount: 3,
    features: ['Full Leather', 'Wood & Chrome', 'Heated & Ventilated']
  },
  {
    id: 27,
    name: 'Sport Turbo',
    price: 389.99,
    category: 'Sports Car',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Turbo sport steering wheel for high-performance cars',
    model: 'ST-2023',
    stockCount: 11,
    features: ['Aluminum Frame', 'Perforated Leather', 'Red Accents']
  },
  {
    id: 28,
    name: 'Mountain Truck',
    price: 479.99,
    category: 'SUV/Truck',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Mountain truck steering wheel for off-road vehicles',
    model: 'MT-2023',
    stockCount: 7,
    features: ['Heavy Duty', 'Heated', 'All-Weather']
  },
  {
    id: 29,
    name: 'Retro Modern',
    price: 429.99,
    category: 'Classic',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Retro modern steering wheel combining classic and modern design',
    model: 'RM-2023',
    stockCount: 6,
    features: ['Classic Design', 'Modern Materials', 'Handcrafted']
  },
  {
    id: 30,
    name: 'Gaming Ultra',
    price: 329.99,
    category: 'Gaming',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Ultimate gaming steering wheel for professional gamers',
    model: 'GU-2023',
    stockCount: 15,
    features: ['Force Feedback', '1080° Rotation', 'Advanced Pedals']
  },
  {
    id: 31,
    name: 'Universal Max',
    price: 219.99,
    category: 'Universal',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Maximum compatibility universal steering wheel',
    model: 'UM-2023',
    stockCount: 28,
    features: ['Universal Fit', 'Easy Installation', 'Durable']
  },
  {
    id: 32,
    name: 'Premium Custom',
    price: 899.99,
    category: 'Custom',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Premium custom steering wheel with personalization options',
    model: 'PC-2023',
    stockCount: 2,
    features: ['Full Customization', 'Premium Materials', 'Handmade']
  },
];