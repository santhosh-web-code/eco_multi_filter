import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { fetchMeta, fetchProducts } from '../api/productApi.js'
import {
  filterReducer,
  initialFilterState,
  selectFilterCriteria,
} from '../state/filterReducer.js'
import { useDebouncedValue } from './useDebouncedValue.js'

export function useProductCatalog() {
  const [state, dispatch] = useReducer(filterReducer, initialFilterState)
  const [metadata, setMetadata] = useState({
    data: null,
    status: 'loading',
    error: null,
  })
  const [catalog, setCatalog] = useState({
    items: [],
    matched: 0,
    total: 0,
    status: 'loading',
    error: null,
  })
  const requestIdRef = useRef(0)
  const debouncedPriceRange = useDebouncedValue(state.priceRange, 150)
  const filters = useMemo(
    () => selectFilterCriteria(
      { ...state, priceRange: debouncedPriceRange },
      metadata.data?.priceBounds,
    ),
    [state.categories, state.minRating, debouncedPriceRange, metadata.data?.priceBounds],
  )

  useEffect(() => {
    const controller = new AbortController()

    fetchMeta(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setMetadata({ data, status: 'success', error: null })
        }
      })
      .catch((error) => {
        if (error.name === 'AbortError' || controller.signal.aborted) {
          return
        }

        setMetadata({ data: null, status: 'error', error })
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (metadata.status === 'loading') {
      return undefined
    }

    const controller = new AbortController()
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    setCatalog((currentCatalog) => ({
      ...currentCatalog,
      status: 'loading',
      error: null,
    }))

    fetchProducts(filters, state.sort, controller.signal)
      .then((response) => {
        if (controller.signal.aborted || requestId !== requestIdRef.current) {
          return
        }

        setCatalog({
          items: response.data,
          matched: response.meta.matched,
          total: response.meta.total,
          status: 'success',
          error: null,
        })
      })
      .catch((error) => {
        if (
          error.name === 'AbortError'
          || controller.signal.aborted
          || requestId !== requestIdRef.current
        ) {
          return
        }

        setCatalog((currentCatalog) => ({
          ...currentCatalog,
          status: 'error',
          error,
        }))
      })

    return () => controller.abort()
  }, [filters, metadata.status, state.sort])

  const status = metadata.status === 'loading' || catalog.status === 'loading'
    ? 'loading'
    : metadata.error || catalog.error
      ? 'error'
      : 'success'

  return {
    items: catalog.items,
    matched: catalog.matched,
    total: catalog.total,
    meta: metadata.data,
    status,
    error: catalog.error || metadata.error,
    state,
    dispatch,
  }
}
