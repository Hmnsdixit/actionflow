import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/login', '/signup'],
      disallow: ['/dashboard', '/new-meeting', '/meetings'],
    },
    sitemap: 'https://actionflow-sand.vercel.app/sitemap.xml',
  }
}