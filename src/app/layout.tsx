// app/layout.tsx
import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/hooks/useCart';

// Distinctive font pairing: editorial serif + clean sans
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title:       'Mithila Art Studio — Authentic Madhubani Paintings & Handknits',
  description: 'Hand-painted Mithila / Madhubani art and handknitted pieces crafted with care. Each piece carries a story.',
  keywords:    ['Madhubani', 'Mithila painting', 'Indian folk art', 'handknit', 'handmade'],
  openGraph: {
    title:       'Mithila Art Studio',
    description: 'Authentic Madhubani paintings and handknits',
    type:        'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="bg-[var(--color-bg)] text-[var(--color-ink)] font-body antialiased">
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
