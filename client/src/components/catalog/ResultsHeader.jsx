import { formatCount } from '../../utils/format.js'
import { SortDropdown } from './SortDropdown.jsx'

export function ResultsHeader({
  matched,
  total,
  sort,
  sortOptions,
  onSortChange,
}) {
  return (
    <div className="results-header">
      <p aria-atomic="true" aria-live="polite" className="results-header__count">
        Showing {formatCount(matched)} of {formatCount(total)} products
      </p>
      <SortDropdown
        onChange={onSortChange}
        options={sortOptions}
        value={sort}
      />
    </div>
  )
}
