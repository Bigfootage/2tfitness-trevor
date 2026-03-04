import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Lifestyle Method – DM Dashboard',
  description: 'DM setter performance tracking dashboard for The Lifestyle Method',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
