# Bisatim

**bisatim.com** — Artisanal rugs and carpets for the everyday home.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Animation**: Framer Motion
- **Language**: TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://bisatim.com
```

## Project Structure

```
src/
├── app/          # Next.js App Router pages & layouts
├── components/   # Shared UI components
├── context/      # React context (cart, wishlist)
├── lib/          # Supabase client, db helpers, utilities
└── views/        # Page-level view components
```

## Brand

- **Website**: [bisatim.com](https://bisatim.com)
- **Instagram**: [@bisatim_](https://www.instagram.com/bisatim_/)
- **TikTok**: [@bisatim_](https://www.tiktok.com/@bisatim_)
- **Pinterest**: [bisatim_](https://www.pinterest.com/bisatim_/)

## Build

```bash
npm run build
npm run start
```
