'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type CategoryFilter = 'mithila_painting' | 'knitting' | undefined;
type TypeFilter     = 'ready_to_ship' | 'made_to_order' | undefined;
type SortOption     = 'newest' | 'price_asc' | 'price_desc' | undefined;

interface ShopFiltersProps {
  active: {
    category?: string;
    type?:     string;
    sort?:     string;
  };
}

export default function ShopFilters({ active }: ShopFiltersProps) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  // No default fallback here anymore — if there's no category param, the
  // "All" tab (value: undefined) is what should be highlighted, because
  // that's genuinely what the data on screen reflects.
  const activeCategory = active.category as CategoryFilter;
  const activeType     = active.type     as TypeFilter;
  const activeSort     = active.sort     as SortOption;

  const categories: { value: CategoryFilter; label: string }[] = [
    { value: undefined,          label: 'All'                },
    { value: 'mithila_painting', label: 'Mithila Paintings'  },
    { value: 'knitting',         label: 'Knitting'           },
  ];

  const types: { value: TypeFilter; label: string }[] = [
    { value: undefined,        label: 'All'           },
    { value: 'ready_to_ship',  label: 'Ready to Ship' },
    { value: 'made_to_order',  label: 'Made to Order' },
  ];

  const sorts: { value: SortOption; label: string }[] = [
    { value: undefined,     label: 'Newest'        },
    { value: 'price_asc',   label: 'Price: Low–High' },
    { value: 'price_desc',  label: 'Price: High–Low' },
  ];

  const pillBase: React.CSSProperties = {
    fontFamily:    '"DM Sans", system-ui, sans-serif',
    fontSize:      '0.875rem',
    cursor:        'pointer',
    border:        'none',
    background:    'none',
    padding:       '8px 0',
    transition:    'color 0.18s',
    whiteSpace:    'nowrap',
  };

  return (
    <div style={{ marginBottom: '0' }}>

      {/* ── Category tabs (All / Mithila Paintings / Knitting) ── */}
      <div
        role="tablist"
        aria-label="Filter by category"
        style={{
          display:       'flex',
          gap:           '0',
          borderBottom:  '1px solid #E8E4DC',
          marginBottom:  '28px',
        }}
      >
        {categories.map(cat => {
          const isSelected = activeCategory === cat.value;
          return (
            <button
              key={cat.value ?? 'all'}
              role="tab"
              aria-selected={isSelected}
              onClick={() => updateParam('category', cat.value)}
              style={{
                ...pillBase,
                fontWeight:    isSelected ? 500 : 400,
                color:         isSelected ? '#1A1714' : '#9B9187',
                marginRight:   '32px',
                paddingBottom: '12px',
                borderBottom:  isSelected ? '2px solid #1A1714' : '2px solid transparent',
                marginBottom:  '-1px',
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* ── Secondary filters row ── */}
      <div style={{
        display:        'flex',
        flexWrap:       'wrap',
        alignItems:     'center',
        gap:            '24px',
        justifyContent: 'space-between',
        marginBottom:   '36px',
      }}>

        {/* Type filter */}
        <div
          role="group"
          aria-label="Filter by availability"
          style={{ display: 'flex', gap: '0', alignItems: 'center' }}
        >
          <span style={{
            fontFamily:    '"DM Sans", system-ui, sans-serif',
            fontSize:      '0.75rem',
            fontWeight:    500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color:         '#9B9187',
            marginRight:   '16px',
          }}>
            Availability
          </span>
          <div style={{
            display:      'flex',
            gap:          '0',
            background:   '#F0EDE6',
            padding:      '3px',
          }}>
            {types.map(t => {
              const isSelected = activeType === t.value;
              return (
                <button
                  key={t.value ?? 'all'}
                  aria-pressed={isSelected}
                  onClick={() => updateParam('type', t.value)}
                  style={{
                    fontFamily:  '"DM Sans", system-ui, sans-serif',
                    fontSize:    '0.8125rem',
                    fontWeight:  isSelected ? 500 : 400,
                    color:       isSelected ? '#1A1714' : '#6B6057',
                    background:  isSelected ? '#FAFAF7' : 'transparent',
                    border:      'none',
                    padding:     '6px 14px',
                    cursor:      'pointer',
                    transition:  'background 0.15s, color 0.15s',
                    whiteSpace:  'nowrap',
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label
            htmlFor="shop-sort"
            style={{
              fontFamily:    '"DM Sans", system-ui, sans-serif',
              fontSize:      '0.75rem',
              fontWeight:    500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color:         '#9B9187',
              whiteSpace:    'nowrap',
            }}
          >
            Sort by
          </label>
          <select
            id="shop-sort"
            value={activeSort ?? ''}
            onChange={e => updateParam('sort', e.target.value || undefined)}
            style={{
              fontFamily:  '"DM Sans", system-ui, sans-serif',
              fontSize:    '0.875rem',
              color:       '#1A1714',
              background:  '#FAFAF7',
              border:      '1px solid #E8E4DC',
              padding:     '7px 28px 7px 12px',
              cursor:      'pointer',
              appearance:  'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236B6057' stroke-width='1.25' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat:   'no-repeat',
              backgroundPosition: 'right 10px center',
              outline:     'none',
            }}
          >
            {sorts.map(s => (
              <option key={s.value ?? 'newest'} value={s.value ?? ''}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}