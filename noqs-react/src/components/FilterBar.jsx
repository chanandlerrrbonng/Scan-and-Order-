const CATEGORIES = [
  { label: 'All Items', value: 'All' },
  { label: '🍛 Biryani', value: 'Biryani' },
  { label: '🥗 Starters', value: 'Starters' },
  { label: '🍞 Breads', value: 'Breads' },
  { label: '🍖 Mains', value: 'Mains' },
  { label: '🥤 Drinks', value: 'Drinks' },
  { label: '🍮 Desserts', value: 'Desserts' }
];

export default function FilterBar({ activeCategory, onCategoryChange }) {
  return (
    <section className="filter-bar" aria-label="Menu categories">
      <div className="filter-inner">
        <p className="sr-only">Filter by category:</p>
        <div className="filter-scroll" role="list">
          {CATEGORIES.map((c) => {
            const active = c.value === activeCategory;
            return (
              <button
                key={c.value}
                className={`filter-chip${active ? ' active' : ''}`}
                role="listitem"
                aria-pressed={active}
                onClick={() => onCategoryChange(c.value)}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
