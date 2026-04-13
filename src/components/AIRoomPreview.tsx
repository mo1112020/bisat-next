import React from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Eye, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const AIRoomPreview = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-bisat-black py-24 overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
              <span className="text-bisat-gold text-[10px] uppercase tracking-[0.3em] font-bold">
                {t('aiRoom.badge')}
              </span>
              <span className="bg-bisat-gold/10 text-bisat-gold px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold border border-bisat-gold/20">
                {t('aiRoom.beta')}
              </span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-serif text-bisat-cream leading-tight">
              {t('aiRoom.title')}
            </h2>
            
            <p className="text-bisat-cream/60 max-w-md text-lg leading-relaxed font-light">
              {t('aiRoom.description')}
            </p>
            
            <button className="group flex items-center gap-3 text-bisat-cream hover:text-bisat-gold transition-colors">
              <span className="text-xs uppercase tracking-[0.2em] font-bold border-b border-bisat-cream/30 pb-1 group-hover:border-bisat-gold/50 transition-colors">
                {t('aiRoom.button')}
              </span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Right Visuals */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-bisat-cream/5 rounded-3xl p-8 border border-bisat-cream/10 backdrop-blur-sm">
              <div className="grid grid-rows-2 gap-4 h-[400px]">
                
                {/* Upload Area */}
                <div className="border-2 border-dashed border-bisat-cream/20 rounded-2xl flex flex-col items-center justify-center space-y-4 hover:border-bisat-gold/40 transition-colors cursor-pointer group">
                  <div className="bg-bisat-cream/10 p-4 rounded-full group-hover:bg-bisat-gold/20 transition-colors">
                    <Upload className="text-bisat-gold" size={24} />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-bisat-cream/60 group-hover:text-bisat-cream transition-colors">
                    {t('aiRoom.upload')}
                  </span>
                </div>

                {/* Processing State */}
                <div className="bg-bisat-cream/5 rounded-2xl relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-bisat-gold/10 to-transparent opacity-50" />
                  <div className="relative flex items-center gap-3 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-bisat-cream/10">
                    <Eye size={16} className="text-bisat-gold animate-pulse" />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-bisat-gold">
                      {t('aiRoom.processing')}
                    </span>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-bisat-gold/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-bisat-gold/5 rounded-full blur-3xl" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
