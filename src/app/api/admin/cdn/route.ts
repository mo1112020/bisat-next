import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Development hack: Bypass SSL certificate verification for local environments
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  try {
    const https = require('https');
    if (https.globalAgent) https.globalAgent.options.rejectUnauthorized = false;
  } catch (e) {}
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const BUCKET = 'cdn';

// GET /api/admin/cdn — list all files
export async function GET() {
  const { data, error } = await supabaseAdmin.storage.from(BUCKET).list('', {
    limit: 500,
    sortBy: { column: 'updated_at', order: 'desc' },
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const files = (data ?? [])
    .filter(f => f.name !== '.emptyFolderPlaceholder')
    .map(f => ({
      name: f.name,
      id: f.id ?? f.name,
      updated_at: f.updated_at ?? '',
      size: f.metadata?.size ?? 0,
      mimetype: f.metadata?.mimetype ?? 'image/*',
      publicUrl: supabaseAdmin.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
    }));

  return NextResponse.json({ files });
}

// POST /api/admin/cdn — upload a file
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
  }

  // 15 MB hard limit on server side
  if (file.size > 15 * 1024 * 1024) {
    return NextResponse.json({ error: `${file.name} exceeds the 15 MB limit` }, { status: 400 });
  }

  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabaseAdmin.storage.from(BUCKET).upload(safeName, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(safeName);
  return NextResponse.json({ ok: true, name: safeName, publicUrl: data.publicUrl });
}

// DELETE /api/admin/cdn — delete a file
export async function DELETE(req: NextRequest) {
  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 });

  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([name]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
