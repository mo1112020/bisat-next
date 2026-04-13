"use client";
import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const SIZES = [
  {
    label: "2' × 3'",
    tag: 'Accent',
    use: 'Entryway, beside bed, small bathroom',
    room: 'Fits in a hallway or small corner',
    dim: { w: 24, h: 36 },
  },
  {
    label: "4' × 6'",
    tag: 'Small',
    use: 'Coffee table, office, nursery',
    room: "Seats a small 2–3 person sofa arrangement",
    dim: { w: 48, h: 72 },
  },
  {
    label: "5' × 8'",
    tag: 'Medium',
    use: 'Living room, dining room (4–6 chairs)',
    room: 'Most popular size — fits front legs of all furniture',
    dim: { w: 60, h: 96 },
  },
  {
    label: "8' × 10'",
    tag: 'Large',
    use: 'Living room, master bedroom',
    room: 'All furniture legs on rug — luxurious feel',
    dim: { w: 96, h: 120 },
  },
  {
    label: "9' × 12'",
    tag: 'X-Large',
    use: 'Grand living room, open-plan dining',
    room: 'Statement piece — defines an entire space',
    dim: { w: 108, h: 144 },
  },
  {
    label: "2.5' × 10'",
    tag: 'Runner',
    use: 'Hallway, kitchen, staircase',
    room: 'Long narrow spaces — creates flow and warmth',
    dim: { w: 30, h: 120 },
  },
];

const TIPS = [
  { icon: '📐', tip: 'Leave at least 18" of bare floor between the rug edge and the wall.' },
  { icon: '🛋️', tip: "In a living room, all front legs of your sofa and chairs should sit on the rug." },
  { icon: '🛏️', tip: 'For bedrooms, a 5×8 or 8×10 centered under the bed with 24" showing on each side looks best.' },
  { icon: '🍽️', tip: 'Dining room: choose a rug at least 24" larger than your table on all sides so chairs stay on the rug when pulled out.' },
];

interface SizeGuideProps {
  trigger?: React.ReactNode;
}

export const SizeGuide = ({ trigger }: SizeGuideProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger ?? (
          <button className="flex items-center gap-1.5 text-[11px] font-bold text-bisat-black/40 uppercase tracking-wider hover:text-bisat-gold transition-colors">
            <Ruler size={13} /> Size Guide
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-white rounded-3xl z-[61] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-bisat-black/5 flex-shrink-0">
                <div>
                  <h2 className="font-serif text-xl text-bisat-black">Rug Size Guide</h2>
                  <p className="text-[11px] text-bisat-black/40 mt-0.5">Find the perfect size for your space</p>
                </div>
                <button onClick={() => setOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-bisat-cream transition-colors text-bisat-black/40">
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-6 space-y-6">
                {/* Size cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SIZES.map(s => (
                    <div key={s.label} className="flex gap-4 p-4 rounded-2xl border border-bisat-black/6 hover:border-bisat-gold/30 hover:bg-bisat-cream/30 transition-all group">
                      {/* Visual box */}
                      <div className="flex-shrink-0 flex items-end justify-center" style={{ width: 56, height: 56 }}>
                        <div
                          className="bg-bisat-gold/15 border-2 border-bisat-gold/40 rounded-sm group-hover:border-bisat-gold transition-colors"
                          style={{
                            width:  Math.round((s.dim.w / 144) * 52),
                            height: Math.round((s.dim.h / 144) * 52),
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <p className="font-bold text-bisat-black text-sm">{s.label}</p>
                          <span className="text-[9px] uppercase tracking-wider font-bold text-bisat-gold">{s.tag}</span>
                        </div>
                        <p className="text-[11px] text-bisat-black/50 leading-snug">{s.use}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tips */}
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-bisat-black/30 mb-3">Pro Tips</p>
                  <div className="space-y-2.5">
                    {TIPS.map(t => (
                      <div key={t.tip} className="flex gap-3 items-start">
                        <span className="text-base flex-shrink-0">{t.icon}</span>
                        <p className="text-[12px] text-bisat-black/60 leading-relaxed">{t.tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
