'use client';
import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../components/PageHeader';
import { Meta } from '../components/Meta';

export const KVKK = () => {
  const { t } = useTranslation();

  return (
    <div className="pb-16 bg-bisat-ivory min-h-screen">
      <Meta
        title="KVKK Aydınlatma Metni"
        description="Kişisel verilerin korunması kanunu kapsamında Bisatim aydınlatma metni."
        robots="noindex, follow"
      />
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-6">
        <PageHeader badge={t('kvkk.badge')} title={t('kvkk.title')} />
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
          <div className="prose prose-lg text-bisat-black/70 font-light space-y-6">
            <p>
              {t('kvkk.intro')}
            </p>
            <h2 className="text-2xl font-sans text-bisat-black mt-8 mb-4">{t('kvkk.s1_t')}</h2>
            <p>
              {t('kvkk.s1_c')}
            </p>

            <h2 className="text-2xl font-sans text-bisat-black mt-8 mb-4">{t('kvkk.s2_t')}</h2>
            <p>
              {t('kvkk.s2_c')}
            </p>

            <h2 className="text-2xl font-sans text-bisat-black mt-8 mb-4">{t('kvkk.s3_t')}</h2>
            <p>
              {t('kvkk.s3_c')}
            </p>

            <h2 className="text-2xl font-sans text-bisat-black mt-8 mb-4">{t('kvkk.s4_t')}</h2>
            <p>
              {t('kvkk.s4_c')}<a href="mailto:privacy@bisatim.com" className="text-bisat-gold hover:underline">privacy@bisatim.com</a>.
            </p>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
};
