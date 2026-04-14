import React from 'react';

interface PageHeaderProps {
  badge?: string;
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ badge, title, description, children }) => {
  return (
    <div className="mb-14 border-b border-bisat-border pb-8 pt-10 sm:pt-12">
      {badge && (
        <p className="bisat-kicker mb-4">
          {badge}
        </p>
      )}
      <h1 className="bisat-heading text-4xl md:text-5xl mb-4 max-w-3xl">
        {title}
      </h1>
      {description && (
        <p className="bisat-copy max-w-2xl text-sm">
          {description}
        </p>
      )}
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
};
