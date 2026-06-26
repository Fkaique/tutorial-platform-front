interface Category {
  id: string;
  name: string;
}

interface CategoryFiltersProps {
  categories: Category[] | null | undefined;
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function CategoryFilters({ categories, selectedId, onSelect }: CategoryFiltersProps) {
  return (
    <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
      <button
        onClick={() => onSelect('')}
        className={`px-5 py-2 rounded-xl text-sm font-sans-serif font-semibold transition whitespace-nowrap snap-start cursor-pointer ${selectedId === ''
            ? 'bg-[var(--color-secondary)] col-primary shadow-md'
            : 'bg-white/5 col-white/60 hover:bg-white/10 hover:col-white border border-white/5'
          }`}
      >
        Tudo
      </button>

      {Array.isArray(categories) && categories.map(category => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`px-5 py-2 rounded-xl text-sm font-sans-serif font-semibold transition whitespace-nowrap snap-start cursor-pointer ${selectedId === category.id
              ? 'bg-[var(--color-secondary)] col-primary shadow-md'
              : 'bg-white/5 col-white/60 hover:bg-white/10 hover:col-white border border-white/5'
            }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}