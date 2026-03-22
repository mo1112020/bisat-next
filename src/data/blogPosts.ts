export interface BlogPostData {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
  metaDescription?: string;
}

export const BLOG_POSTS: BlogPostData[] = [
  {
    id: '1',
    title: 'The Art of the Persian Knot: A History',
    excerpt: 'Discover the centuries-old techniques that make Persian rugs the gold standard of textile artistry.',
    metaDescription: 'Explore the rich history of the Persian knot, its unique asymmetrical technique, and why it remains the gold standard in artisanal rug weaving.',
    content: `
      <p>The Persian knot, also known as the Senneh knot, is a cornerstone of textile history. For centuries, artisans in the plateau of Iran have used this asymmetrical knot to create the most intricate and detailed designs known to man.</p>
      <p>Unlike the symmetrical Turkish knot, the Persian knot allows for a higher knot density, enabling weavers to create fluid, curved lines and complex floral patterns that seem to dance across the wool or silk surface.</p>
      <h3>The Technique</h3>
      <p>A master weaver can tie up to 10,000 knots in a single day, but a high-quality Tabriz or Isfahan rug can contain millions of knots, meaning a single piece can take years to complete. This patience is what separates a true Persian masterpiece from a mass-produced imitation.</p>
      <p>The process begins with the preparation of the loom, followed by the careful selection of hand-spun wool or silk, often dyed using natural vegetable extracts like madder root for reds, indigo for blues, and pomegranate skins for yellows.</p>
      <blockquote>"Every knot is a silent prayer, a testament to a lineage of artistry that refuses to be forgotten in the age of machines."</blockquote>
      <h3>Preserving the Heritage</h3>
      <p>Today, we work directly with families in Tabriz and Isfahan to ensure these techniques are passed down. By choosing a hand-knotted Persian rug, you aren't just buying a floor covering; you are becoming a custodian of a living history.</p>
    `,
    image: 'https://placehold.co/1200x800',
    date: 'March 15, 2026',
    author: 'Amir Rahmani',
    category: 'Heritage'
  },
  {
    id: '2',
    title: 'How to Choose the Perfect Rug for Your Living Room',
    excerpt: 'Size, material, and pattern—everything you need to know to find the foundation of your space.',
    metaDescription: 'A comprehensive guide on selecting the right rug size, material, and style to anchor your living room and create a cohesive interior design.',
    content: `
      <p>Finding the right rug is like finding the soul of a room. It anchors the furniture, defines the space, and sets the emotional tone of your home.</p>
      <h3>Size Matters</h3>
      <p>The most common mistake is choosing a rug that is too small. In a living room, your rug should be large enough that at least the front legs of all major furniture pieces sit on it. This creates a sense of unity and prevents the "floating furniture" look.</p>
      <h3>Material and Lifestyle</h3>
      <p>If you have a high-traffic home with children or pets, a hand-knotted wool rug is your best friend. Wool is naturally stain-resistant and incredibly durable. For a formal space where elegance is the priority, a silk-blend rug offers a luminous sheen that changes with the light.</p>
      <p>Consider the color palette of your walls and upholstery. A bold, geometric Kilim can add energy to a neutral room, while a faded Oushak provides a sense of calm and timelessness.</p>
    `,
    image: 'https://placehold.co/1200x800',
    date: 'March 10, 2026',
    author: 'Elena Vance',
    category: 'Design'
  },
  {
    id: '3',
    title: 'Sustainable Weaving: The Future of Artisanal Rugs',
    excerpt: 'How natural dyes and ethical sourcing are preserving both the environment and ancient cultures.',
    metaDescription: 'Discover how the artisanal rug industry is leading the way in sustainability through natural dyes, ethical sourcing, and cultural preservation.',
    content: `
      <p>Sustainability isn't a trend in the world of artisanal rugs; it's the original way of making things. Before the industrial revolution, every rug was a product of its immediate environment.</p>
      <h3>Natural Dyes</h3>
      <p>We are seeing a massive resurgence in the use of vegetable dyes. These dyes are not only better for the environment but they also age more gracefully than chemical alternatives. They develop a "patina" over time, a subtle softening of color that collectors call 'abrash'.</p>
      <h3>Ethical Sourcing</h3>
      <p>True sustainability also means sustaining the people who make the art. We ensure fair wages and safe working conditions for all our artisan partners. This ethical foundation allows the craft to thrive and ensures that the next generation of weavers sees a future in their heritage.</p>
    `,
    image: 'https://placehold.co/1200x800',
    date: 'March 05, 2026',
    author: 'Julian Thorne',
    category: 'Sustainability'
  }
];
