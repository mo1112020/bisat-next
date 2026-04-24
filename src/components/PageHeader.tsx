import React from 'react';

interface PageHeaderProps {
  badge?: string;
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ badge, title, description, children }) => {
  return (
    <div className="mb-14 border-b border-bisat-border pb-10 pt-12 sm:pt-16">
      {badge && (
        <p className="bisat-kicker mb-5">
          {badge}
        </p>
      )}
      <h1 className="font-sans font-normal text-[2rem] sm:text-[2.5rem] tracking-[-0.025em] leading-[1.15] text-bisat-black mb-5 max-w-3xl">
        {title}
      </h1>
      {description && (
        <p className="text-[15px] leading-relaxed text-bisat-black/52 max-w-2xl">
          {description}
        </p>
      )}
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
};
