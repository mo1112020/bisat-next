'use client';
import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../components/PageHeader';
import { Meta } from '../components/Meta';

export const Privacy = () => {
  const { t } = useTranslation();

  return (
    <div className="pb-16 bg-white min-h-screen">
      <Meta
        title="Privacy Policy"
        description="Bisatim's privacy policy outlining how we collect, use and protect your personal data."
      />
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-6">
        <PageHeader badge={t('privacy.badge')} title={t('privacy.title')} />
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
          <div className="prose prose-lg text-bisat-black/70 font-light space-y-6">
            <p>
              {t('privacy.intro')}
            </p>
            <h2 className="text-2xl font-sans text-bisat-black mt-8 mb-4">{t('privacy.s1_t')}</h2>
            <p>
              {t('privacy.s1_c')}
            </p>

            <h2 className="text-2xl font-sans text-bisat-black mt-8 mb-4">{t('privacy.s2_t')}</h2>
            <p>
              {t('privacy.s2_c')}
            </p>

            <h2 className="text-2xl font-sans text-bisat-black mt-8 mb-4">{t('privacy.s3_t')}</h2>
            <p>
              {t('privacy.s3_c')}<a href="mailto:privacy@bisatim.com" className="text-bisat-gold hover:underline">privacy@bisatim.com</a>.
            </p>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
};
