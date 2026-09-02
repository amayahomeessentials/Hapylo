import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Replace with your actual live domain if different
  const baseUrl = 'https://hapylo.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Disallow search engines from indexing the admin dashboard and API routes
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
