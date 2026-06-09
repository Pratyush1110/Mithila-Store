"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: '/shop?category=mithila_painting', label: 'Mithila Paintings', primary: true  },
    { href: '/shop?category=knitting',          label: 'Knitting',          primary: false },
    { href: '/track-order',                    label: 'Track Order',       primary: false },
  ];

  const isActive = (href: string) => {
    const path = href.split('?')[0];
    return pathname === path || (path !== '/' && pathname.startsWith(path));
  };

  return (
    <header style={{ background: '#FAFAF7', borderBottom: '1px solid #E8E4DC' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 32px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '32px',
      }}>

        {/* ── Brand ── */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#1A1714',
            letterSpacing: '0.01em',
            lineHeight: 1,
          }}>
            Kavita Arts &amp; Crafts
          </span>
        </Link>

        {/* ── Desktop Nav (Hidden on Mobile automatically via Tailwind) ── */}
        <nav
          aria-label="Main navigation"
          style={{ alignItems: 'center', gap: '36px', marginLeft: 'auto' }}
          className="hidden sm:flex"
        >
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: '"DM Sans", system-ui, sans-serif',
                fontSize: '0.875rem',
                fontWeight: link.primary ? 500 : 400,
                color: isActive(link.href) ? '#C8A96E' : link.primary ? '#1A1714' : '#6B6057',
                textDecoration: 'none',
                letterSpacing: '0.02em',
                paddingBottom: '2px',
                borderBottom: isActive(link.href) ? '1.5px solid #C8A96E' : '1.5px solid transparent',
                transition: 'color 0.2s, border-color 0.2s',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Cart Icon ── */}
        <Link
          href="/cart"
          aria-label={`Shopping cart, ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1A1714"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {totalItems > 0 && (
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                minWidth: '17px',
                height: '17px',
                borderRadius: '50%',
                background: '#C8A96E',
                color: '#FAFAF7',
                fontSize: '0.6rem',
                fontWeight: 600,
                fontFamily: '"DM Sans", system-ui, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
                padding: '0 3px',
              }}
            >
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </Link>

        {/* ── Mobile Hamburger Menu Button (Flex only on mobile viewports) ── */}
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            flexDirection: 'column',
            gap: '5px',
            flexShrink: 0,
          }}
          className="flex sm:hidden"
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                display: 'block',
                width: '22px',
                height: '1.5px',
                background: '#1A1714',
                transition: 'transform 0.2s, opacity 0.2s',
                transformOrigin: 'center',
                transform:
                  menuOpen && i === 0 ? 'translateY(6.5px) rotate(45deg)' :
                  menuOpen && i === 1 ? 'scaleX(0)' :
                  menuOpen && i === 2 ? 'translateY(-6.5px) rotate(-45deg)' :
                  'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* ── Mobile Menu Dropdown Panel ── */}
      <div
        aria-hidden={!menuOpen}
        style={{
          display: menuOpen ? 'flex' : 'none',
          flexDirection: 'column',
          borderTop: '1px solid #E8E4DC',
          background: '#FAFAF7',
          padding: '12px 32px 20px',
          gap: '0',
        }}
      >
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: '"DM Sans", system-ui, sans-serif',
              fontSize: '0.9375rem',
              fontWeight: link.primary ? 500 : 400,
              color: isActive(link.href) ? '#C8A96E' : '#1A1714',
              textDecoration: 'none',
              padding: '12px 0',
              borderBottom: '1px solid #F0EDE6',
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}