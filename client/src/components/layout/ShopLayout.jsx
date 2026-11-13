import { TopBar } from './TopBar.jsx'

export function ShopLayout({ children, status }) {
  return (
    <div className="shop-shell">
      <TopBar status={status} />
      <main className="shop-grid">{children}</main>
    </div>
  )
}
