
export const Header = () => {
  return (
    <header style={{
      padding: '1.5rem 0',
      borderBottom: '1px solid var(--card-border)',
      marginBottom: '2rem'
    }}>
      <div className="container">
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '800',
          letterSpacing: '-0.02em',
          background: 'linear-gradient(to right, #fff, #a1a1aa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Manhole Card Collector
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          日本の路上の文化遺産を集めよう
        </p>
      </div>
    </header>
  );
};
