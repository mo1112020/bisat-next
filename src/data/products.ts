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
  salePrice?: number;
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
