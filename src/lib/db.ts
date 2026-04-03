import { supabase } from './supabase';
import { Product, Review } from '../data/products';
import { BlogPostData } from '../data/blogPosts';

function toReview(row: Record<string, unknown>): Review {
  return {
    id: row.id as string,
    userName: row.user_name as string,
    rating: row.rating as number,
    comment: row.comment as string,
    date: row.date as string,
  };
}

function toProduct(row: Record<string, unknown>): Product {
  const reviews = Array.isArray(row.product_reviews)
    ? (row.product_reviews as Record<string, unknown>[]).map(toReview)
    : [];
  return {
    id: row.id as string,
    name: row.name as string,
    category: row.category as Product['category'],
    price: row.price as number,
    description: row.description as string,
    images: (row.images as string[]) || [],
    dimensions: row.dimensions as string,
    sizeCategory: row.size_category as Product['sizeCategory'],
    rooms: (row.rooms as Product['rooms'][number][]) || [],
    material: row.material as string,
    origin: row.origin as string,
    stock: row.stock as number,
    reviews,
  };
}

function toBlogPost(row: Record<string, unknown>): BlogPostData {
  return {
    id: row.id as string,
    title: row.title as string,
    excerpt: row.excerpt as string,
    content: row.content as string,
    image: row.image as string,
    date: row.date as string,
    author: row.author as string,
    category: row.category as string,
    metaDescription: row.meta_description as string | undefined,
  };
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return (data || []).map(toProduct);
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_reviews(*)')
    .eq('id', id)
    .single();
  if (error) return null;
  return toProduct(data);
}

export async function getRelatedProducts(category: string, excludeId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', excludeId)
    .limit(4);
  if (error) return [];
  return (data || []).map(toProduct);
}

export async function getBlogPosts(): Promise<BlogPostData[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return (data || []).map(toBlogPost);
}

export async function getBlogPost(id: string): Promise<BlogPostData | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return toBlogPost(data);
}

export async function getOrder(id: string): Promise<{
  id: string; status: string; date: string;
  items: string[]; estimatedDelivery: string; location: string;
} | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id.toUpperCase())
    .single();
  if (error) return null;
  return {
    id: data.id,
    status: data.status,
    date: data.date,
    items: data.items || [],
    estimatedDelivery: data.estimated_delivery,
    location: data.location,
  };
}

export async function getTestimonials(): Promise<{
  id: string; name: string; location: string; title: string;
  text: string; date: string; rating: number; category: string;
}[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return (data || []).map(row => ({
    id: row.id,
    name: row.name,
    location: row.location,
    title: row.title,
    text: row.text,
    date: row.date,
    rating: row.rating,
    category: row.category,
  }));
}

export async function addProductReview(
  productId: string,
  review: { userName: string; rating: number; comment: string }
): Promise<void> {
  const { error } = await supabase.from('product_reviews').insert({
    product_id: productId,
    user_name: review.userName,
    rating: review.rating,
    comment: review.comment,
  });
  if (error) console.error(error);
}

// ─── Admin functions ────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const [p, o, r, b, t] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('product_reviews').select('*', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }),
  ]);
  return {
    products: p.count || 0,
    orders: o.count || 0,
    reviews: r.count || 0,
    blogPosts: b.count || 0,
    testimonials: t.count || 0,
  };
}

export async function adminGetOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('date', { ascending: false });
  if (error) { console.error(error); return []; }
  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    status: row.status as string,
    date: row.date as string,
    items: (row.items as string[]) || [],
    estimatedDelivery: row.estimated_delivery as string,
    location: row.location as string,
  }));
}

export async function adminUpdateOrderStatus(id: string, status: string): Promise<boolean> {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) { console.error(error); return false; }
  return true;
}

export async function adminCreateProduct(data: {
  name: string; category: string; price: number; description: string;
  images: string[]; dimensions: string; sizeCategory: string; rooms: string[];
  material: string; origin: string; stock: number;
}): Promise<Product | null> {
  const { data: row, error } = await supabase
    .from('products')
    .insert({
      name: data.name, category: data.category, price: data.price,
      description: data.description, images: data.images,
      dimensions: data.dimensions, size_category: data.sizeCategory,
      rooms: data.rooms, material: data.material, origin: data.origin,
      stock: data.stock,
    })
    .select()
    .single();
  if (error) { console.error(error); return null; }
  return toProduct(row);
}

export async function adminUpdateProduct(
  id: string,
  data: {
    name: string; category: string; price: number; description: string;
    images: string[]; dimensions: string; sizeCategory: string; rooms: string[];
    material: string; origin: string; stock: number;
  }
): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .update({
      name: data.name, category: data.category, price: data.price,
      description: data.description, images: data.images,
      dimensions: data.dimensions, size_category: data.sizeCategory,
      rooms: data.rooms, material: data.material, origin: data.origin,
      stock: data.stock,
    })
    .eq('id', id);
  if (error) { console.error(error); return false; }
  return true;
}

export async function adminDeleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) { console.error(error); return false; }
  return true;
}

export async function adminCreateBlogPost(data: {
  title: string; excerpt: string; content: string; image: string;
  date: string; author: string; category: string; metaDescription: string;
}): Promise<boolean> {
  const { error } = await supabase.from('blog_posts').insert({
    title: data.title, excerpt: data.excerpt, content: data.content,
    image: data.image, date: data.date, author: data.author,
    category: data.category, meta_description: data.metaDescription,
  });
  if (error) { console.error(error); return false; }
  return true;
}

export async function adminUpdateBlogPost(
  id: string,
  data: {
    title: string; excerpt: string; content: string; image: string;
    date: string; author: string; category: string; metaDescription: string;
  }
): Promise<boolean> {
  const { error } = await supabase
    .from('blog_posts')
    .update({
      title: data.title, excerpt: data.excerpt, content: data.content,
      image: data.image, date: data.date, author: data.author,
      category: data.category, meta_description: data.metaDescription,
    })
    .eq('id', id);
  if (error) { console.error(error); return false; }
  return true;
}

export async function adminDeleteBlogPost(id: string): Promise<boolean> {
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) { console.error(error); return false; }
  return true;
}

export async function adminGetAllReviews() {
  const { data, error } = await supabase
    .from('product_reviews')
    .select('*, products(name)')
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    productId: row.product_id as string,
    productName: ((row.products as Record<string, unknown>)?.name as string) || 'Unknown',
    userName: row.user_name as string,
    rating: row.rating as number,
    comment: row.comment as string,
    date: row.date as string,
  }));
}

export async function adminDeleteReview(id: string): Promise<boolean> {
  const { error } = await supabase.from('product_reviews').delete().eq('id', id);
  if (error) { console.error(error); return false; }
  return true;
}

export async function adminCreateTestimonial(data: {
  name: string; location: string; title: string; text: string;
  date: string; rating: number; category: string;
}): Promise<boolean> {
  const { error } = await supabase.from('testimonials').insert(data);
  if (error) { console.error(error); return false; }
  return true;
}

export async function adminDeleteTestimonial(id: string): Promise<boolean> {
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) { console.error(error); return false; }
  return true;
}
