import { StarRating } from '../common/StarRating.jsx'

const RATING_OPTIONS = [
  { value: 0, label: 'Any' },
  { value: 1, label: '1 star & up' },
  { value: 2, label: '2 stars & up' },
  { value: 3, label: '3 stars & up' },
  { value: 4, label: '4 stars & up' },
  { value: 5, label: '5 stars & up' },
]

export function RatingRadioGroup({ value, onChange }) {
  return (
    <fieldset className="filter-fieldset">
      <legend className="filter-section-title">Rating</legend>
      <div className="rating-options">
        {RATING_OPTIONS.map((option) => (
          <label className="rating-option" key={option.value}>
            <input
              checked={value === option.value}
              className="rating-option__input"
              name="minimum-rating"
              onChange={() => onChange(option.value)}
              type="radio"
              value={option.value}
            />
            <span className="rating-option__stamp">
              {option.value > 0 && (
                <span aria-hidden="true" className="rating-option__stars">
                  <StarRating rating={option.value} />
                </span>
              )}
              <span>{option.label}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
