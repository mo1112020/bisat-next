import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_TOKEN = 'bisat_admin_secret_2026';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  if (username === 'adminbaba' && password === 'admin123') {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', ADMIN_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
}
