import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Project LOOP - AI Customer-Feedback Intelligence Platform',
  description: 'Enterprise AI customer feedback intelligence platform for collecting, analyzing, and acting on customer sentiment and product insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
