import { NextResponse } from 'next/server';
import { getCategories, getRoomTypes, getSizeCategories } from '@/src/lib/db';

export async function GET() {
  const [dbCategories, dbRooms, dbSizes] = await Promise.all([
    getCategories(),
    getRoomTypes(),
    getSizeCategories(),
  ]);

  const categories = dbCategories.length > 0 ? dbCategories.map(c => c.name) : ['Handmade', 'Vintage', 'Modern', 'Kilim'];
  const rooms      = dbRooms.length > 0 ? dbRooms.map(r => r.name) : ['Living Room', 'Bedroom', 'Dining Room', 'Hallway', 'Office'];
  const sizes      = dbSizes.length > 0 ? dbSizes.map(s => s.name) : ['Small', 'Medium', 'Large', 'Runner'];

  return NextResponse.json({
    categories,
    rooms,
    sizes,
  });
}
