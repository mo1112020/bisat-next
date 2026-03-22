export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Handmade' | 'Vintage' | 'Machine' | 'Kilim';
  price: number;
  description: string;
  images: string[];
  dimensions: string;
  sizeCategory: 'Small' | 'Medium' | 'Large' | 'Runner';
  rooms: ('Living Room' | 'Bedroom' | 'Dining Room' | 'Hallway' | 'Office')[];
  material: string;
  origin: string;
  stock: number;
  reviews: Review[];
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Hereke Imperial Silk Rug',
    category: 'Handmade',
    price: 3850,
    description: 'A masterpiece of Turkish weaving from the imperial workshops of Hereke. This rug features a high knot density with pure silk threads, showcasing the classic "Seven Mountains" pattern.',
    images: [
      'https://placehold.co/1000x800',
      'https://placehold.co/1000x800'
    ],
    dimensions: '4\' x 6\'',
    sizeCategory: 'Small',
    rooms: ['Bedroom', 'Office'],
    material: '100% Pure Silk',
    origin: 'Hereke, Turkey',
    stock: 1,
    reviews: [
      { id: 'r1', userName: 'Sarah J.', rating: 5, comment: 'The silk detail is breathtaking. A true heirloom piece.', date: '2026-02-15' }
    ]
  },
  {
    id: '2',
    name: 'Antique Oushak Medallion',
    category: 'Vintage',
    price: 2450,
    description: 'A genuine vintage Oushak rug from the early 20th century. Known for its soft, muted palette and large-scale floral patterns, it brings a touch of history to any modern space.',
    images: [
      'https://placehold.co/1000x800',
      'https://placehold.co/1000x800'
    ],
    dimensions: '9\' x 12\'',
    sizeCategory: 'Large',
    rooms: ['Living Room', 'Dining Room'],
    material: 'Hand-spun Wool',
    origin: 'Uşak, Turkey',
    stock: 1,
    reviews: [
      { id: 'r2', userName: 'Michael R.', rating: 5, comment: 'The colors are beautifully faded. Exactly what I was looking for.', date: '2026-03-01' }
    ]
  },
  {
    id: '3',
    name: 'Anatolian Tribal Kilim',
    category: 'Kilim',
    price: 1200,
    description: 'Vibrant geometric patterns tell the story of Anatolian heritage. Each Kilim is unique, flat-woven by nomadic tribes using traditional techniques.',
    images: [
      'https://placehold.co/1000x800',
      'https://placehold.co/1000x800'
    ],
    dimensions: '5\' x 7\'',
    sizeCategory: 'Medium',
    rooms: ['Living Room', 'Bedroom'],
    material: 'Hand-spun Wool',
    origin: 'Anatolia, Turkey',
    stock: 3,
    reviews: []
  },
  {
    id: '4',
    name: 'Modern Machine-Woven Sultan',
    category: 'Machine',
    price: 450,
    description: 'A high-quality machine-woven rug that captures the essence of traditional Turkish designs. Durable, easy to clean, and perfect for high-traffic areas.',
    images: [
      'https://placehold.co/1000x800',
      'https://placehold.co/1000x800'
    ],
    dimensions: '8\' x 10\'',
    sizeCategory: 'Large',
    rooms: ['Living Room', 'Dining Room', 'Hallway'],
    material: 'Heat-set Polypropylene',
    origin: 'Gaziantep, Turkey',
    stock: 15,
    reviews: [
      { id: 'r3', userName: 'Emma L.', rating: 4, comment: 'Great quality for the price. Looks very similar to a handmade one.', date: '2026-01-20' }
    ]
  },
  {
    id: '5',
    name: 'Vintage Isparta Floral',
    category: 'Vintage',
    price: 1850,
    description: 'A vintage Isparta rug featuring a dense floral field and a rich crimson border. These rugs are celebrated for their durability and classic Anatolian motifs.',
    images: [
      'https://placehold.co/1000x800'
    ],
    dimensions: '6\' x 9\'',
    sizeCategory: 'Medium',
    rooms: ['Living Room', 'Bedroom'],
    material: 'Wool on Cotton',
    origin: 'Isparta, Turkey',
    stock: 2,
    reviews: []
  },
  {
    id: '6',
    name: 'Kayseri Silk-on-Silk Prayer Rug',
    category: 'Handmade',
    price: 2900,
    description: 'A fine Kayseri prayer rug, hand-knotted with silk on a silk foundation. The intricate mihrab design is a testament to the skill of Turkish artisans.',
    images: [
      'https://placehold.co/1000x800'
    ],
    dimensions: '3\' x 5\'',
    sizeCategory: 'Small',
    rooms: ['Bedroom', 'Office'],
    material: 'Pure Silk',
    origin: 'Kayseri, Turkey',
    stock: 1,
    reviews: []
  },
  {
    id: '7',
    name: 'Machine-Woven Anatolian Runner',
    category: 'Machine',
    price: 180,
    description: 'A practical and stylish runner for your hallway. Features traditional Anatolian patterns in a modern, easy-care construction.',
    images: [
      'https://placehold.co/1000x800'
    ],
    dimensions: '2.5\' x 10\'',
    sizeCategory: 'Runner',
    rooms: ['Hallway'],
    material: 'Synthetic Blend',
    origin: 'Gaziantep, Turkey',
    stock: 20,
    reviews: []
  }
];
