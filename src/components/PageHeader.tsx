import React from 'react';

interface PageHeaderProps {
  badge?: string;
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ badge, title, description, children }) => {
  return (
    <div className="mb-10">
      {badge && (
        <p className="text-bisat-gold text-[10px] uppercase tracking-[0.35em] font-bold mb-3">
          {badge}
        </p>
      )}
      <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-bisat-black mb-3">
        {title}
      </h1>
      {description && (
        <p className="text-bisat-black/50 text-sm leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
      {children}
    </div>
  );
};
