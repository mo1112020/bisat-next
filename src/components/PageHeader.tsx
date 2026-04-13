import React from 'react';

interface PageHeaderProps {
  badge?: string;
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ badge, title, description, children }) => {
  return (
    <div className="mb-12 pt-8">
      {badge && (
        <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-4">
          {badge}
        </p>
      )}
      <h1 className="text-3xl md:text-4xl font-light text-bisat-black mb-4 leading-tight">
        {title}
      </h1>
      {description && (
        <p className="text-bisat-black/50 text-sm leading-relaxed max-w-2xl font-light">
          {description}
        </p>
      )}
      {children}
    </div>
  );
};
