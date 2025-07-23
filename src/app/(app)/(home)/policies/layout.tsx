import React from 'react';

// We inherit the navbar and footer from the (home) layout
// This layout only adds specific styling for policy pages
export default function PolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="policy-content bg-white max-w-6xl mx-auto my-8 rounded-lg shadow-sm">
      {children}
    </div>
  );
}
