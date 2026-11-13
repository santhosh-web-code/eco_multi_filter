const SORT_LABELS = {
  featured: 'Featured',
  price_asc: 'Price: Low to High',
  price_desc: 'Price: High to Low',
  rating_desc: 'Top Rated First',
  name_asc: 'Name A–Z',
}

export function SortDropdown({ options, value, onChange }) {
  return (
    <div className="sort-control">
      <label className="sort-control__label" htmlFor="product-sort">
        Sort by
      </label>
      <select
        className="sort-control__select"
        disabled={options.length === 0}
        id="product-sort"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {SORT_LABELS[option] ?? option}
          </option>
        ))}
      </select>
    </div>
  )
}
