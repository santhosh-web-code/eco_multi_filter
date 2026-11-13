export function ErrorBanner({ error, onRetry }) {
  return (
    <section aria-label="Catalog error" className="error-banner" role="alert">
      <div>
        <p className="error-banner__title">We couldn’t load the catalog.</p>
        <p className="error-banner__message">{error.message}</p>
      </div>
      <button className="error-banner__retry" onClick={onRetry} type="button">
        Retry
      </button>
    </section>
  )
}
