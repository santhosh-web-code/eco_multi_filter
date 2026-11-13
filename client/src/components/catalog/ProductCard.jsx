import { StarRating } from '../common/StarRating.jsx'
import { formatCount, formatPrice } from '../../utils/format.js'

export function ProductCard({ product, index = 0 }) {
  return (
    <article
      className="product-card"
      style={{ '--card-index': Math.min(index, 10) }}
    >
      <div className="product-card__media">
        <img
          alt={product.name}
          className="product-card__image"
          decoding="async"
          loading="lazy"
          src={product.thumbnailUrl}
        />
        {product.tag && (
          <span className={`product-tag product-tag--${product.tag.toLowerCase()}`}>
            {product.tag}
          </span>
        )}
      </div>
      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <h3 className="product-card__name" title={product.name}>{product.name}</h3>
        <div className="product-card__rating">
          <StarRating rating={product.rating} />
          <span className="product-card__rating-value">
            {Number(product.rating).toFixed(1)}
          </span>
        </div>
        <p className="product-card__reviews">
          {formatCount(product.reviewCount)} reviews
        </p>
        <p className="product-card__price">{formatPrice(product.price)}</p>
      </div>
    </article>
  )
}
