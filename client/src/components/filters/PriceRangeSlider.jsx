import { useMemo, useRef, useState } from 'react'
import { formatCount, formatPrice } from '../../utils/format.js'

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function getSensibleStep(range) {
  const targetStep = Math.max(1, Math.ceil(range / 500))

  for (let distance = 0; distance <= targetStep; distance += 1) {
    const lowerStep = targetStep - distance
    const upperStep = targetStep + distance

    if (lowerStep > 0 && range % lowerStep === 0) {
      return lowerStep
    }
    if (range % upperStep === 0) {
      return upperStep
    }
  }

  return 1
}

export function PriceRangeSlider({
  priceBounds,
  priceHistogram,
  value,
  onChange,
}) {
  const [activeThumb, setActiveThumb] = useState('min')
  const rangeRef = useRef(null)
  const hasValidBounds = Number.isFinite(priceBounds?.min)
    && Number.isFinite(priceBounds?.max)
    && priceBounds.max > priceBounds.min

  const min = hasValidBounds ? priceBounds.min : 0
  const max = hasValidBounds ? priceBounds.max : 0
  const step = hasValidBounds ? getSensibleStep(max - min) : 1
  const lowerValue = hasValidBounds
    ? clamp(value?.min ?? min, min, max - step)
    : 0
  const upperValue = hasValidBounds
    ? clamp(value?.max ?? max, lowerValue + step, max)
    : 0
  const lowerPosition = hasValidBounds
    ? ((lowerValue - min) / (max - min)) * 100
    : 0
  const upperPosition = hasValidBounds
    ? ((upperValue - min) / (max - min)) * 100
    : 100
  const largestBucket = useMemo(
    () => Math.max(1, ...priceHistogram.map((bucket) => bucket.count)),
    [priceHistogram],
  )

  function updateRange(nextMin, nextMax) {
    onChange({
      min: clamp(nextMin, min, max - step),
      max: clamp(nextMax, min + step, max),
    })
  }

  function handleTrackPointerDown(event) {
    if (!hasValidBounds || event.target !== event.currentTarget) {
      return
    }

    const bounds = rangeRef.current?.getBoundingClientRect()
    if (!bounds || bounds.width <= 0) {
      return
    }

    event.preventDefault()
    const ratio = clamp((event.clientX - bounds.left) / bounds.width, 0, 1)
    const valueAtPointer = min + Math.round(((max - min) * ratio) / step) * step
    const nextValue = clamp(valueAtPointer, min, max)
    const moveLowerThumb = Math.abs(nextValue - lowerValue)
      <= Math.abs(nextValue - upperValue)

    if (moveLowerThumb) {
      setActiveThumb('min')
      updateRange(Math.min(nextValue, upperValue - step), upperValue)
    } else {
      setActiveThumb('max')
      updateRange(lowerValue, Math.max(nextValue, lowerValue + step))
    }
  }

  function handleLowerChange(event) {
    setActiveThumb('min')
    updateRange(Number(event.target.value), upperValue)
  }

  function handleUpperChange(event) {
    setActiveThumb('max')
    updateRange(lowerValue, Number(event.target.value))
  }

  if (!hasValidBounds) {
    return (
      <fieldset className="filter-fieldset">
        <legend className="filter-section-title">Price</legend>
        <p className="filter-help">Price range is unavailable.</p>
      </fieldset>
    )
  }

  return (
    <fieldset className="filter-fieldset">
      <legend className="filter-section-title">Price</legend>
      <div
        aria-label="Price distribution across all products"
        className="price-histogram"
        role="img"
      >
        {priceHistogram.map((bucket, index) => {
          const isSelected = bucket.max >= lowerValue && bucket.min <= upperValue
          const height = Math.max(4, (bucket.count / largestBucket) * 100)

          return (
            <span
              aria-hidden="true"
              className={`price-histogram__bar${isSelected ? ' is-selected' : ''}`}
              key={`${bucket.min}-${bucket.max}`}
              style={{ height: `${height}%` }}
              title={`${formatPrice(bucket.min)}–${formatPrice(bucket.max)}: ${formatCount(bucket.count)} products`}
              data-bucket-index={index}
            />
          )
        })}
      </div>
      <div className="price-slider">
        <div
          aria-hidden="true"
          className="price-slider__track-hit-area"
          onPointerDown={handleTrackPointerDown}
          ref={rangeRef}
        >
          <span className="price-slider__track" />
          <span
            className="price-slider__selection"
            style={{
              left: `${lowerPosition}%`,
              width: `${upperPosition - lowerPosition}%`,
            }}
          />
        </div>
        <input
          aria-label="Minimum price"
          aria-valuetext={formatPrice(lowerValue)}
          className={`price-slider__input${activeThumb === 'min' ? ' is-active' : ''}`}
          max={max - step}
          min={min}
          onChange={handleLowerChange}
          onFocus={() => setActiveThumb('min')}
          onPointerDown={() => setActiveThumb('min')}
          step={step}
          type="range"
          value={lowerValue}
        />
        <input
          aria-label="Maximum price"
          aria-valuetext={formatPrice(upperValue)}
          className={`price-slider__input${activeThumb === 'max' ? ' is-active' : ''}`}
          max={max}
          min={min + step}
          onChange={handleUpperChange}
          onFocus={() => setActiveThumb('max')}
          onPointerDown={() => setActiveThumb('max')}
          step={step}
          type="range"
          value={upperValue}
        />
      </div>
      <div aria-live="polite" className="price-slider__values">
        <span>
          <span className="visually-hidden">Minimum price </span>
          {formatPrice(lowerValue)}
        </span>
        <span>
          <span className="visually-hidden">Maximum price </span>
          {formatPrice(upperValue)}
        </span>
      </div>
      <p className="filter-help">Use arrow keys for precise adjustments.</p>
    </fieldset>
  )
}
