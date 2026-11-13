import { useEffect, useRef } from 'react'

export function EmptyState({ onReset }) {
  const headingRef = useRef(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <section aria-live="polite" className="empty-state">
      <span aria-hidden="true" className="empty-state__sticker">
        SOLD
        <br />
        OUT
      </span>
      <p className="eyebrow">A little too specific?</p>
      <h2 ref={headingRef} className="empty-state__heading" tabIndex={-1}>
        No items match your criteria.
      </h2>
      <p className="empty-state__copy">
        Loosen a filter or start fresh to find your next favorite.
      </p>
      <button className="empty-state__reset" onClick={onReset} type="button">
        Reset filters
      </button>
    </section>
  )
}
