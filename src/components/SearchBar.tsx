
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <input
        type="text"
        placeholder="都道府県、市町村で検索..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '1rem',
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '8px',
          color: 'var(--foreground)',
          fontSize: '1rem',
          outline: 'none'
        }}
      />
    </div>
  );
};
