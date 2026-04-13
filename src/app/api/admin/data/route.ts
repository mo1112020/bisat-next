import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/src/lib/db';
import type { SiteImageKey } from '@/src/lib/db';

const ADMIN_TOKEN = 'bisat_admin_secret_2026';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const session = req.cookies.get('admin_session');
  if (!session || session.value !== ADMIN_TOKEN) return unauthorized();

  const body = await req.json();
  const { op, ...args } = body as { op: string; [key: string]: unknown };

  try {
    let result: unknown;

    switch (op) {
      // ── Read ────────────────────────────────────────────────────────────
      case 'getProducts':            result = await db.getProducts(); break;
      case 'getDashboardStats':      result = await db.getDashboardStats(); break;
      case 'adminGetOrders':         result = await db.adminGetOrders(); break;
      case 'adminGetAllReviews':     result = await db.adminGetAllReviews(); break;
      case 'getBlogPosts':           result = await db.getBlogPosts(); break;
      case 'getTestimonials':        result = await db.getTestimonials(); break;
      case 'getSiteSettings':        result = await db.getSiteSettings(); break;
      case 'getSiteImages':          result = await db.getSiteImages(); break;
      case 'adminGetCategories':     result = await db.adminGetCategories(); break;
      case 'adminGetRoomTypes':      result = await db.adminGetRoomTypes(); break;
      case 'adminGetSizeCategories': result = await db.adminGetSizeCategories(); break;

      // ── Products ────────────────────────────────────────────────────────
      case 'adminCreateProduct':
        result = await db.adminCreateProduct(args.data as Parameters<typeof db.adminCreateProduct>[0]);
        break;
      case 'adminUpdateProduct':
        result = await db.adminUpdateProduct(args.id as string, args.data as Parameters<typeof db.adminUpdateProduct>[1]);
        break;
      case 'adminDeleteProduct':
        result = await db.adminDeleteProduct(args.id as string);
        break;

      // ── Orders ──────────────────────────────────────────────────────────
      case 'adminUpdateOrderStatus':
        result = await db.adminUpdateOrderStatus(args.id as string, args.status as string);
        break;

      // ── Reviews ─────────────────────────────────────────────────────────
      case 'adminDeleteReview':
        result = await db.adminDeleteReview(args.id as string);
        break;

      // ── Blog ────────────────────────────────────────────────────────────
      case 'adminCreateBlogPost':
        result = await db.adminCreateBlogPost(args.data as Parameters<typeof db.adminCreateBlogPost>[0]);
        break;
      case 'adminUpdateBlogPost':
        result = await db.adminUpdateBlogPost(args.id as string, args.data as Parameters<typeof db.adminUpdateBlogPost>[1]);
        break;
      case 'adminDeleteBlogPost':
        result = await db.adminDeleteBlogPost(args.id as string);
        break;

      // ── Testimonials ─────────────────────────────────────────────────────
      case 'adminCreateTestimonial':
        result = await db.adminCreateTestimonial(args.data as Parameters<typeof db.adminCreateTestimonial>[0]);
        break;
      case 'adminDeleteTestimonial':
        result = await db.adminDeleteTestimonial(args.id as string);
        break;

      // ── Site settings / images ───────────────────────────────────────────
      case 'adminUpsertSiteSetting':
        result = await db.adminUpsertSiteSetting(args.key as string, args.value as string);
        break;
      case 'adminUpsertSiteImage':
        result = await db.adminUpsertSiteImage(args.key as SiteImageKey, args.url as string);
        break;

      // ── Categories ───────────────────────────────────────────────────────
      case 'adminCreateCategory':
        result = await db.adminCreateCategory(args.data as Parameters<typeof db.adminCreateCategory>[0]);
        break;
      case 'adminUpdateCategory':
        result = await db.adminUpdateCategory(args.id as string, args.data as Parameters<typeof db.adminUpdateCategory>[1]);
        break;
      case 'adminDeleteCategory':
        result = await db.adminDeleteCategory(args.id as string);
        break;

      // ── Room types ───────────────────────────────────────────────────────
      case 'adminCreateRoomType':
        result = await db.adminCreateRoomType(args.data as Parameters<typeof db.adminCreateRoomType>[0]);
        break;
      case 'adminUpdateRoomType':
        result = await db.adminUpdateRoomType(args.id as string, args.data as Parameters<typeof db.adminUpdateRoomType>[1]);
        break;
      case 'adminDeleteRoomType':
        result = await db.adminDeleteRoomType(args.id as string);
        break;

      // ── Size categories ──────────────────────────────────────────────────
      case 'adminCreateSizeCategory':
        result = await db.adminCreateSizeCategory(args.data as Parameters<typeof db.adminCreateSizeCategory>[0]);
        break;
      case 'adminUpdateSizeCategory':
        result = await db.adminUpdateSizeCategory(args.id as string, args.data as Parameters<typeof db.adminUpdateSizeCategory>[1]);
        break;
      case 'adminDeleteSizeCategory':
        result = await db.adminDeleteSizeCategory(args.id as string);
        break;

      default:
        return NextResponse.json({ error: `Unknown operation: ${op}` }, { status: 400 });
    }

    return NextResponse.json(result ?? null);
  } catch (err) {
    console.error('[admin/data]', op, err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
