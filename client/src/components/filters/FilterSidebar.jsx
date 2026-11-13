import { selectFilterCriteria } from '../../state/filterReducer.js'
import { CategoryChecklist } from './CategoryChecklist.jsx'
import { PriceRangeSlider } from './PriceRangeSlider.jsx'
import { RatingRadioGroup } from './RatingRadioGroup.jsx'

export function FilterSidebar({
  state,
  metadata,
  onToggleCategory,
  onPriceRangeChange,
  onRatingChange,
  onReset,
}) {
  const criteria = selectFilterCriteria(state, metadata?.priceBounds)
  const activeCount = criteria.categories.length
    + (criteria.minPrice !== null || criteria.maxPrice !== null ? 1 : 0)
    + (criteria.minRating !== null ? 1 : 0)

  return (
    <aside aria-label="Product filters" className="filter-sidebar">
      <div className="filter-sidebar__header">
        <h1 className="filter-sidebar__title">Filters</h1>
        <span aria-label={`${activeCount} active filters`} className="filter-count">
          {activeCount}
        </span>
      </div>
      <button
        className="filter-reset"
        disabled={activeCount === 0}
        onClick={onReset}
        type="button"
      >
        Reset all
      </button>
      <div className="filter-sidebar__sections">
        <CategoryChecklist
          categories={metadata?.categories ?? []}
          onToggleCategory={onToggleCategory}
          selectedCategories={state.categories}
        />
        <PriceRangeSlider
          onChange={onPriceRangeChange}
          priceBounds={metadata?.priceBounds}
          priceHistogram={metadata?.priceHistogram ?? []}
          value={state.priceRange}
        />
        <RatingRadioGroup
          onChange={onRatingChange}
          value={state.minRating}
        />
      </div>
    </aside>
  )
}
