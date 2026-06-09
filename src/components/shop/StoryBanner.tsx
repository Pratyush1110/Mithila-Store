export default function StoryBanner() {
  return (
    <section
      aria-label="About Mithila art"
      style={{
        background:  '#1A1714',
        padding:     '72px 32px',
        position:    'relative',
        overflow:    'hidden',
      }}
    >
      {/* Double-line top and bottom border */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '7px',
        background: 'linear-gradient(#C8A96E 0px, #C8A96E 1.5px, transparent 1.5px, transparent 4px, #C8A96E 4px, #C8A96E 5.5px, #1A1714 5.5px)',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '7px',
        background: 'linear-gradient(#1A1714 0px, #C8A96E 1.5px, #C8A96E 3px, transparent 3px, transparent 5.5px, #C8A96E 5.5px, #C8A96E 7px)',
      }} />

      <div style={{
        maxWidth:  '720px',
        margin:    '0 auto',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily:    '"DM Sans", system-ui, sans-serif',
          fontSize:      '0.6875rem',
          fontWeight:    500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color:         '#C8A96E',
          marginBottom:  '24px',
        }}>
          The Tradition
        </p>
        <blockquote style={{ margin: 0 }}>
          <p style={{
            fontFamily:   '"Playfair Display", Georgia, serif',
            fontSize:     'clamp(1.25rem, 3vw, 1.75rem)',
            fontWeight:   400,
            fontStyle:    'italic',
            color:        '#E8E4DC',
            lineHeight:   1.6,
            margin:       '0 0 28px',
          }}>
            "In Mithila, women have painted the walls of their homes since before
            memory — at weddings, at births, at the arrival of rains. The motifs
            are prayers. The act of painting is prayer."
          </p>
          <cite style={{
            fontFamily:    '"DM Sans", system-ui, sans-serif',
            fontSize:      '0.875rem',
            color:         '#7A7068',
            fontStyle:     'normal',
            letterSpacing: '0.04em',
          }}>
            — from the artist's journal
          </cite>
        </blockquote>
      </div>
    </section>
  );
}
