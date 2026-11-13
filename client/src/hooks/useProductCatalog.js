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
  const [metadataAttempt, setMetadataAttempt] = useState(0)
  const [catalogAttempt, setCatalogAttempt] = useState(0)
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
  }, [metadataAttempt])

  useEffect(() => {
    if (metadata.status !== 'success') {
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
  }, [catalogAttempt, filters, metadata.status, state.sort])

  function retry() {
    if (metadata.status === 'error') {
      setMetadata((currentMetadata) => ({
        ...currentMetadata,
        status: 'loading',
        error: null,
      }))
      setMetadataAttempt((attempt) => attempt + 1)
      return
    }

    setCatalog((currentCatalog) => ({
      ...currentCatalog,
      status: 'loading',
      error: null,
    }))
    setCatalogAttempt((attempt) => attempt + 1)
  }

  const status = metadata.status === 'success' ? catalog.status : metadata.status

  return {
    items: catalog.items,
    matched: catalog.matched,
    total: catalog.total,
    meta: metadata.data,
    status,
    error: metadata.status === 'error' ? metadata.error : catalog.error,
    state,
    dispatch,
    retry,
  }
}
