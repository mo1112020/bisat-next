import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/src/lib/db';

export const revalidate = 3600;

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}
