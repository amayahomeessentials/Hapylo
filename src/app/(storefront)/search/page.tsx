import { ProductCard } from '@/components/product/ProductCard'
import { createClient } from '@supabase/supabase-js'

// Force dynamic so search always runs on request
export const dynamic = 'force-dynamic'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : ''

  let products = []
  
  if (query) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('is_active', true)
      .limit(40)

    if (data) {
      products = data
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-display font-extrabold text-on-surface tracking-tight">
          {query ? `Search results for "${query}"` : 'Search our catalog'}
        </h1>
        {query && (
          <p className="mt-4 text-on-surface-variant">
            Found {products.length} {products.length === 1 ? 'product' : 'products'} matching your search.
          </p>
        )}
      </div>

      {!query ? (
        <div className="max-w-xl mx-auto">
          <form action="/search" method="GET" className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">
              <span className="material-symbols-outlined text-[24px]">search</span>
            </span>
            <input
              type="search"
              name="q"
              placeholder="Search for products, categories..."
              className="w-full rounded-full border border-outline-variant bg-surface px-12 py-4 text-base text-on-surface shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
            <button type="submit" className="absolute inset-y-2 right-2 rounded-full bg-primary px-6 text-sm font-bold text-on-primary hover:bg-primary-fixed transition-colors">
              Search
            </button>
          </form>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface-container/30 rounded-3xl">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">search_off</span>
          <h2 className="text-xl font-bold text-on-surface mb-2">No results found</h2>
          <p className="text-on-surface-variant mb-6">We couldn't find anything matching "{query}". Try another search term.</p>
          <a href="/search" className="btn-primary rounded-xl px-6 py-3 text-sm font-medium">Clear Search</a>
        </div>
      )}
    </div>
  )
}
