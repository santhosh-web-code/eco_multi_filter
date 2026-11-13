export function TopBar({ status }) {
  return (
    <header className="top-bar">
      <a className="brand" href="/" aria-label="E-Commerce Multi-Filter home">
        E-Commerce Multi-Filter
      </a>
      <p className="top-bar-status" role="status">
        API {status}
      </p>
    </header>
  )
}
