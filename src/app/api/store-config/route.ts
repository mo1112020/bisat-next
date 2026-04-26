import { NextResponse } from 'next/server';
import { getCategories, getRoomTypes, getSizeCategories } from '@/src/lib/db';

export const revalidate = 3600;

export async function GET() {
  const [dbCategories, dbRooms, dbSizes] = await Promise.all([
    getCategories(),
    getRoomTypes(),
    getSizeCategories(),
  ]);

  const categories = dbCategories.map(c => c.name);
  const rooms      = dbRooms.map(r => r.name);
  const sizes      = dbSizes.map(s => s.name);

  return NextResponse.json({
    categories,
    rooms,
    sizes,
  });
}
