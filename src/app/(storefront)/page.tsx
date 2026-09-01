import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getBestSellers, getAllCategories } from '@/data/products'
import { ProductGrid } from '@/components/product/ProductGrid'

export const metadata: Metadata = {
  title: 'Hapylo — Make Cleaning Feel Easy',
  description: 'Effortless tools for a spotless space. Plant-powered, ultra-concentrated home care products that elevate your daily routine.',
}

export default async function HomePage() {
  const bestSellers = await getBestSellers()
  const categories = await getAllCategories()

  return (
    <>
      <section className="relative flex min-h-[640px] flex-col overflow-hidden bg-gradient-sage md:h-[760px] md:flex-row">
        <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-16 text-white md:px-12 md:py-0 lg:px-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(239,127,60,0.25),transparent_28%),radial-gradient(circle_at_72%_84%,rgba(167,217,208,0.22),transparent_32%)]" />
          <div className="max-w-2xl">
            <span className="eyebrow relative mb-6 text-primary-fixed">
              Elevated home essentials
            </span>
            <h1 className="relative mb-6 font-display text-5xl leading-tight font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl">
              Clean home. <span className="text-primary-fixed">Clear mind.</span>
            </h1>
            <p className="relative mb-9 max-w-lg text-lg leading-relaxed text-white/75 md:text-xl">
              Thoughtfully designed, plant-powered formulas for the routines that make a house feel like home.
            </p>
            <Link
              href="/shop"
              prefetch={true}
              className="group relative inline-flex w-fit items-center gap-2 rounded-md bg-accent px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-accent-hover"
            >
              Explore the collection
              <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>

        <div className="relative min-h-[400px] flex-1 md:min-h-full">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM36I_ctJ_4eZAPD4rUNjUQTES---yMlBAYYuxniIfAXz0w42w_N4Ut2mGMUj9U_YkwPOsOIMS8z9gnUOIFJvEff3pgkH-S416GBSr3-llitZi1_8Q_4xHr4_nDv-R_XXn3TwZToZogDtRewUD8rK80Vas1Xr3xUTz6VlW7OFVpv335fp76S9fYXPbzRsutiOLDpX5tre_J-RP3jVliH1EFwxoNWlEM9eNVLfuK7y3A553M0tpCsPi"
            alt="Clean modern living room"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent md:bg-gradient-to-r md:from-primary/30 md:via-transparent" />
          <div className="absolute right-6 bottom-6 left-6 rounded-md border border-white/30 bg-white/95 p-5 text-primary shadow-lg backdrop-blur-md md:right-10 md:bottom-10 md:left-auto md:w-72">
            <p className="text-xs font-extrabold tracking-[0.14em] text-accent uppercase">The Hapylo standard</p>
            <p className="mt-2 font-display text-xl font-bold leading-tight">Small rituals. Big difference.</p>
          </div>
        </div>
      </section>

      <section className="section-pad bg-surface">
        <div className="page-wrap">
          <div className="mb-10 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div><span className="eyebrow text-accent">Made for everyday</span><h2 className="section-heading mt-3 text-h2 text-on-surface">Shop the routine, not just the product.</h2></div>
            <Link href="/shop" prefetch={true} className="text-sm font-extrabold tracking-wide text-primary hover:text-accent">VIEW ALL PRODUCTS →</Link>
          </div>
          <div className="no-scrollbar flex snap-x gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-4">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/shop/${cat.slug}`}
                prefetch={true}
                className="group flex w-32 shrink-0 snap-start flex-col items-center gap-4 focus:outline-none md:w-auto"
              >
                <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-surface-container-low bg-surface-container-low shadow-md transition-all duration-300 group-hover:-translate-y-2 group-hover:border-primary-fixed group-hover:shadow-lg">
                  {cat.image_url && (
                     <Image src={cat.image_url} alt={cat.name} width={96} height={96} className="h-full w-full object-cover" />
                  )}
                </div>
                <span className="text-center text-sm font-semibold text-on-surface transition-colors group-hover:text-primary">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-background">
        <div className="page-wrap">
          <div className="mb-8 flex items-end justify-between md:mb-12">
            <div><span className="eyebrow text-accent">Most loved</span><h2 className="section-heading mt-3 text-h2 text-on-surface">
              Best Sellers
            </h2></div>
            <Link
              href="/shop"
              prefetch={true}
              className="flex items-center gap-1 text-sm font-bold text-primary transition-colors hover:text-primary-hover"
            >
              Shop All
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
          <ProductGrid products={bestSellers.slice(0, 4)} columns={4} />
        </div>
      </section>

      <section className="section-pad bg-gradient-sage text-white">
        <div className="page-wrap text-center">
          <span className="eyebrow text-primary-fixed">The Hapylo way</span>
          <h2 className="section-heading mx-auto mt-3 mb-12 text-h2 text-white">
            Better for your home. Better by design.
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
            {[
              { icon: 'eco', title: 'Plant-Powered', desc: 'Every formula is made with plant-derived enzymes and surfactants — zero harsh chemicals.' },
              { icon: 'compress', title: 'Ultra-Concentrated', desc: 'One bottle goes up to 64 loads. Less packaging, less plastic, more clean.' },
              { icon: 'verified', title: 'Dermatologist Tested', desc: 'Hypoallergenic formulas safe for sensitive skin and safe for the environment.' },
            ].map(item => (
              <div key={item.title} className="flex flex-col items-center gap-4 rounded-md border border-white/15 bg-white/10 p-8 transition-all duration-300 hover:-translate-y-2 hover:bg-white/15">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/12 shadow-sm">
                  <span className="material-symbols-outlined text-3xl text-primary-fixed">{item.icon}</span>
                </div>
                <h3 className="font-display text-h4 text-white">{item.title}</h3>
                <p className="text-center text-base leading-relaxed text-white/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="section-pad bg-background text-center">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 rounded-lg bg-gradient-sage px-6 py-24 text-white shadow-lg md:px-14">
          <span className="eyebrow text-primary-fixed">Start fresh</span>
          <h2 className="section-heading text-h2 text-white">
            Bring more ease into every clean.
          </h2>
          <p className="text-lg leading-relaxed text-white/75">
            Join the Hapylo community and transform your home care routine.
          </p>
          <Link
            href="/shop"
            prefetch={true}
            className="group mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-8 py-4 text-base font-bold text-white transition-all hover:-translate-y-1 hover:bg-accent-hover"
          >
            Shop All Products
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
          </Link>
        </div>
      </section>
    </>
  )
}
