import { useEffect, useRef, useState } from 'react'
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
  const activeCountLabel = `${activeCount} active ${activeCount === 1 ? 'filter' : 'filters'}`
  const [isCompact, setIsCompact] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const triggerRef = useRef(null)
  const sidebarRef = useRef(null)
  const showResultsRef = useRef(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 899px)')
    const updateLayout = () => {
      setIsCompact(mediaQuery.matches)
      if (!mediaQuery.matches) {
        setIsDrawerOpen(false)
      }
    }

    updateLayout()
    mediaQuery.addEventListener('change', updateLayout)

    return () => mediaQuery.removeEventListener('change', updateLayout)
  }, [])

  useEffect(() => {
    if (!isCompact || !isDrawerOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    showResultsRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setIsDrawerOpen(false)
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusableElements = sidebarRef.current?.querySelectorAll(
        'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])',
      )

      if (!focusableElements?.length) {
        event.preventDefault()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)

      if (triggerRef.current?.getClientRects().length) {
        triggerRef.current.focus()
      }
    }
  }, [isCompact, isDrawerOpen])

  return (
    <div className="filter-sidebar-shell">
      <button
        aria-controls="product-filter-panel"
        aria-expanded={isDrawerOpen}
        aria-haspopup="dialog"
        aria-label={`Filters, ${activeCountLabel}`}
        className="mobile-filter-toggle"
        onClick={() => setIsDrawerOpen(true)}
        ref={triggerRef}
        type="button"
      >
        <span>Filters</span>
        <span aria-hidden="true" className="filter-count">{activeCount}</span>
      </button>
      {isCompact && isDrawerOpen && (
        <button
          aria-hidden="true"
          className="filter-drawer-backdrop"
          onClick={() => setIsDrawerOpen(false)}
          tabIndex={-1}
          type="button"
        />
      )}
      <aside
        aria-hidden={isCompact && !isDrawerOpen ? true : undefined}
        aria-labelledby="product-filter-heading"
        aria-modal={isCompact && isDrawerOpen ? 'true' : undefined}
        className={`filter-sidebar${isCompact && isDrawerOpen ? ' is-open' : ''}`}
        id="product-filter-panel"
        ref={sidebarRef}
        role={isCompact && isDrawerOpen ? 'dialog' : undefined}
      >
        <div className="filter-sidebar__header">
          <h1 className="filter-sidebar__title" id="product-filter-heading">Filters</h1>
          <span aria-label={activeCountLabel} className="filter-count">
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
        <div className="filter-sidebar__mobile-footer">
          <button
            className="filter-sidebar__show-results"
            onClick={() => setIsDrawerOpen(false)}
            ref={showResultsRef}
            type="button"
          >
            Show Results
          </button>
        </div>
      </aside>
    </div>
  )
}
