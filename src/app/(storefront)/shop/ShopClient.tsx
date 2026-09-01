'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Product, Category } from '@/types/database.types'
import { ProductCard } from '@/components/product/ProductCard'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton'

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest'

const PRODUCTS_PER_PAGE = 12
const FEATURE_FILTERS = ['Eco-Friendly Packaging', 'Fragrance Free', 'Refillable'] as const
type FeatureFilter = typeof FEATURE_FILTERS[number]

export default function ShopClient({ initialProducts, categories }: { initialProducts: Product[], categories: Category[] }) {
  const searchParams = useSearchParams()
  const initialQ = searchParams.get('q') ?? ''

  const [searchQuery, setSearchQuery] = useState(initialQ)
  const [sortBy, setSortBy] = useState<SortOption>('featured')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<FeatureFilter[]>([])
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [sortSheetOpen, setSortSheetOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Sync URL query param to search
  useEffect(() => {
    setSearchQuery(initialQ)
    setCurrentPage(1)
  }, [initialQ])

  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
    )
    setCurrentPage(1)
  }

  const toggleFeature = (feat: FeatureFilter) => {
    setSelectedFeatures(prev =>
      prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]
    )
    setCurrentPage(1)
  }

  const filteredProducts = useMemo(() => {
    let result: Product[] = initialProducts

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q)
      )
    }

    if (selectedCategories.length > 0) {
      result = result.filter(p => {
        const cat = categories.find(c => c.id === p.category_id)
        return cat && selectedCategories.includes(cat.slug)
      })
    }

    if (priceMin) result = result.filter(p => p.price >= Number(priceMin))
    if (priceMax) result = result.filter(p => p.price <= Number(priceMax))

    // Feature filters: Fragrance Free and Eco map to badge/name heuristics
    if (selectedFeatures.includes('Fragrance Free')) {
      result = result.filter(p => p.name.toLowerCase().includes('fragrance') || (p.description ?? '').toLowerCase().includes('fragrance free'))
    }
    if (selectedFeatures.includes('Eco-Friendly Packaging')) {
      result = result.filter(p => p.badge === 'eco' || (p.description ?? '').toLowerCase().includes('eco'))
    }

    switch (sortBy) {
      case 'price-asc': return [...result].sort((a, b) => a.price - b.price)
      case 'price-desc': return [...result].sort((a, b) => b.price - a.price)
      case 'newest': return [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      default: return result
    }
  }, [initialProducts, searchQuery, selectedCategories, priceMin, priceMax, sortBy, categories, selectedFeatures])

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  )

  const SORT_LABELS: Record<SortOption, string> = {
    featured: 'Featured',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low',
    newest: 'Newest',
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="border-b border-outline-variant pb-6">
        <h3 className="mb-4 font-display text-h5 text-on-surface">Category</h3>
        <div className="space-y-3">
          {categories.map(cat => (
            <label key={cat.id} className="group flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.slug)}
                onChange={() => toggleCategory(cat.slug)}
                className="h-5 w-5 rounded-sm border-outline-variant text-primary focus:ring-primary"
              />
              <span className="text-base text-on-surface-variant transition-colors group-hover:text-primary">
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-b border-outline-variant pb-6">
        <h3 className="mb-4 font-display text-h5 text-on-surface">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={e => { setPriceMin(e.target.value); setCurrentPage(1) }}
            className="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <span className="text-on-surface-variant">–</span>
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={e => { setPriceMax(e.target.value); setCurrentPage(1) }}
            className="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-display text-h5 text-on-surface">Features</h3>
        <div className="space-y-3">
          {FEATURE_FILTERS.map(feat => (
            <label key={feat} className="group flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={selectedFeatures.includes(feat)}
                onChange={() => toggleFeature(feat)}
                className="h-5 w-5 rounded-sm border-outline-variant text-primary focus:ring-primary"
              />
              <span className="text-base text-on-surface-variant transition-colors group-hover:text-primary">{feat}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="page-wrap py-8 md:py-12">
        <nav className="mb-6 flex items-center gap-2 text-sm text-on-surface-variant">
          <a href="/" className="transition-colors hover:text-primary">Home</a>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="font-bold text-primary">All Products</span>
        </nav>

        <div className="mb-8 flex flex-col items-start justify-between gap-6 rounded-lg bg-primary px-6 py-8 text-white shadow-lg md:mb-12 md:flex-row md:items-center md:px-10 md:py-10">
          <div><span className="eyebrow text-primary-fixed">The collection</span><h1 className="mt-3 font-display text-h1 font-extrabold tracking-[-0.04em] text-white">All Products</h1><p className="mt-2 text-sm text-white/70">Purposeful formulas for the spaces you live in.</p></div>
          <div className="flex w-full items-center gap-4 md:w-auto">
            <div className="relative w-full md:w-64">
              <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-outline">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                placeholder="Search products..."
                className="w-full rounded-md border border-white/20 bg-white py-3 pr-4 pl-10 text-sm text-on-surface shadow-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <div className="relative min-w-[160px]">
              <select
                value={sortBy}
                onChange={e => { setSortBy(e.target.value as SortOption); setCurrentPage(1) }}
                className="w-full cursor-pointer appearance-none rounded-md border border-white/20 bg-white px-4 py-3 pr-10 text-sm text-on-surface shadow-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-on-surface-variant">expand_more</span>
            </div>
          </div>
        </div>

        {/* Mobile filter/sort strip — now all functional */}
        <div className="no-scrollbar mb-4 flex items-center gap-2 overflow-x-auto py-1 md:hidden">
          <button
            onClick={() => setFilterSheetOpen(true)}
            className="btn-secondary flex items-center gap-1 px-4 py-1.5 text-sm whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            Filters
            {(selectedCategories.length > 0 || selectedFeatures.length > 0) && (
              <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {selectedCategories.length + selectedFeatures.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setSortSheetOpen(true)}
            className="flex items-center gap-1 rounded-md bg-surface px-4 py-1.5 font-label text-label-md text-on-surface whitespace-nowrap shadow-sm"
          >
            Sort: {SORT_LABELS[sortBy]} <span className="material-symbols-outlined text-[18px]">arrow_drop_down</span>
          </button>
          {categories.slice(0, 3).map(cat => (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.slug)}
              className={`rounded-md px-4 py-1.5 font-label text-label-md whitespace-nowrap shadow-sm transition-colors ${
                selectedCategories.includes(cat.slug)
                  ? 'bg-primary text-white'
                  : 'bg-surface text-on-surface'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-8 md:flex-row lg:gap-12">
          <aside className="hidden w-64 shrink-0 md:block">
            <div className="sticky top-28 rounded-md border border-outline-variant bg-surface p-6 shadow-card">
              <p className="mb-6 text-xs font-extrabold tracking-[0.15em] text-accent uppercase">Refine your selection</p>
              <FilterContent />
              <button
                onClick={() => { setSelectedCategories([]); setSelectedFeatures([]); setPriceMin(''); setPriceMax(''); setCurrentPage(1) }}
                className="btn-secondary mt-8 w-full px-4 py-3 text-sm"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          <div className="flex-grow">
            <p className="mb-6 text-sm text-on-surface-variant">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              {searchQuery && ` for "${searchQuery}"`}
              {totalPages > 1 && ` — page ${currentPage} of ${totalPages}`}
            </p>

            {paginatedProducts.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-24 text-center">
                <span className="material-symbols-outlined text-6xl text-outline">search_off</span>
                <h3 className="font-display text-h3 text-on-surface">No products found</h3>
                <p className="text-on-surface-variant">Try adjusting your filters or search term.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategories([]); setSelectedFeatures([]); setPriceMin(''); setPriceMax(''); }}
                  className="btn-primary px-8 py-3"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Real pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  disabled={currentPage === 1}
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    className={`flex h-10 w-10 items-center justify-center rounded-md font-label text-label-md transition-colors ${
                      currentPage === page
                        ? 'bg-primary text-on-primary'
                        : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  disabled={currentPage === totalPages}
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter bottom sheet */}
      <BottomSheet
        open={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        title="Filters"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => { setSelectedCategories([]); setSelectedFeatures([]); setPriceMin(''); setPriceMax(''); setCurrentPage(1) }}
              className="btn-secondary flex-1 py-3 text-base"
            >
              Clear
            </button>
            <button
              onClick={() => setFilterSheetOpen(false)}
              className="btn-primary flex-1 py-3 text-base"
            >
              Show ({filteredProducts.length})
            </button>
          </div>
        }
      >
        <FilterContent />
      </BottomSheet>

      {/* Sort bottom sheet */}
      <BottomSheet
        open={sortSheetOpen}
        onClose={() => setSortSheetOpen(false)}
        title="Sort by"
      >
        <div className="space-y-2">
          {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([val, label]) => (
            <button
              key={val}
              onClick={() => { setSortBy(val); setSortSheetOpen(false); setCurrentPage(1) }}
              className={`flex w-full items-center justify-between rounded-md px-4 py-3 text-sm transition-colors ${
                sortBy === val ? 'bg-secondary-container text-primary font-bold' : 'text-on-surface hover:bg-surface-container-low'
              }`}
            >
              {label}
              {sortBy === val && <span className="material-symbols-outlined text-[18px]">check</span>}
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  )
}
