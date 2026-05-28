import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Scrapling Playground - Adaptive Web Scraping',
  description: 'Try Scrapling — the adaptive web scraping framework that learns from website changes. Parse HTML, extract data, and test CSS/XPath selectors online.',
  keywords: ['web scraping', 'scrapling', 'HTML parser', 'CSS selector', 'XPath', 'data extraction'],
  openGraph: {
    title: 'Scrapling Playground',
    description: 'Adaptive web scraping framework — test it online',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  )
}
