import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductBySlug, getRelatedProducts } from '@/data/products'
import PDPClient from './PDPClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: product.name,
    description: product.description ?? undefined,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const relatedProducts = await getRelatedProducts(product.id, product.category_id)

  return (
    <div className="bg-background">
      <PDPClient product={product} relatedProducts={relatedProducts} />
    </div>
  )
}
