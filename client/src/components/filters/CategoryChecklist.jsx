import { formatCount } from '../../utils/format.js'

export function CategoryChecklist({
  categories,
  selectedCategories,
  onToggleCategory,
}) {
  return (
    <fieldset className="filter-fieldset">
      <legend className="filter-section-title">Category</legend>
      <div className="category-list">
        {categories.map(({ category, count }) => {
          const inputId = `category-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

          return (
            <label className="category-card" htmlFor={inputId} key={category}>
              <input
                checked={selectedCategories.includes(category)}
                className="category-card__input"
                id={inputId}
                onChange={() => onToggleCategory(category)}
                type="checkbox"
              />
              <span aria-hidden="true" className="category-card__tick">✓</span>
              <span className="category-card__name">{category}</span>
              <span className="category-card__count">
                <span className="visually-hidden">{formatCount(count)} products</span>
                <span aria-hidden="true">{formatCount(count)}</span>
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
