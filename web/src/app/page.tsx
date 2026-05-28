'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Code2, Zap, Shield, ArrowRight, Sparkles, Globe, Boxes, Terminal } from 'lucide-react'

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Blazing Fast',
    description: 'Outperforms most Python scraping libraries. Text extraction in 2ms for 5000 elements.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Anti-Bot Bypass',
    description: 'Bypass Cloudflare Turnstile, TLS fingerprinting, and anti-bot detection out of the box.',
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'Adaptive Scraping',
    description: 'Elements are automatically relocated when websites change their structure — no code changes needed.',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Full Browser Support',
    description: 'From fast HTTP requests to full Playwright/Patchright browser automation with session management.',
  },
  {
    icon: <Boxes className="w-6 h-6" />,
    title: 'Spider Framework',
    description: 'Scrapy-like async spiders with pause/resume, concurrent crawling, and proxy rotation.',
  },
  {
    icon: <Terminal className="w-6 h-6" />,
    title: 'MCP Server',
    description: 'Built-in MCP server for AI-assisted scraping with Claude, Cursor, and other AI tools.',
  },
]

const codeExamples = [
  {
    title: 'Basic HTTP Request',
    code: `from scrapling.fetchers import Fetcher

page = Fetcher.get('https://example.com')
title = page.css('h1::text').get()
print(title)`,
  },
  {
    title: 'Stealth Mode',
    code: `from scrapling.fetchers import StealthyFetcher

page = StealthyFetcher.fetch(
    'https://example.com',
    headless=True,
    network_idle=True
)
data = page.css('.product').getall()`,
  },
  {
    title: 'Adaptive Selection',
    code: `from scrapling.fetchers import Fetcher

page = Fetcher.get('https://example.com')
# Save element signature for later
products = page.css('.product', auto_save=True)

# If website changes, Scrapling finds them!
products = page.css('.product', adaptive=True)`,
  },
]

export default function Home() {
  const [activeCode, setActiveCode] = useState(0)

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-emerald-50" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-brand-200/30 to-emerald-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-brand-100/20 to-teal-100/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-6">
              <Code2 className="w-4 h-4" />
              <span>Open Source · BSD-3 License</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
              Scraping that{' '}
              <span className="gradient-text">adapts</span> to
              <br />
              website changes
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Scrapling is the adaptive web scraping framework that handles everything —
              from a single request to a full-scale crawl. One library, zero compromises.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/playground" className="btn-primary text-lg px-8 py-4">
                Try Playground
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="https://github.com/D4Vinci/Scrapling"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-lg px-8 py-4"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, Powerful API</h2>
            <p className="text-gray-600 text-lg">Familiar syntax. Incredible results.</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Tabs */}
            <div className="lg:col-span-2 space-y-2">
              {codeExamples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCode(i)}
                  className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-200 ${
                    activeCode === i
                      ? 'bg-brand-50 border-2 border-brand-200 shadow-sm'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className={`font-semibold ${activeCode === i ? 'text-brand-700' : 'text-gray-700'}`}>
                    {example.title}
                  </div>
                </button>
              ))}
            </div>

            {/* Code Display */}
            <div className="lg:col-span-3">
              <div className="code-block relative">
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <pre className="pt-6"><code className="language-python">{codeExamples[activeCode].code}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From parsing to full-scale crawling — Scrapling has you covered.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Code2 className="w-5 h-5 text-brand-500" />
            <span className="font-bold text-lg">Scrapling</span>
          </div>
          <p className="text-gray-500 text-sm">
            Adaptive Web Scraping Framework · Built for the modern web.
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-400">
            <a href="https://scrapling.readthedocs.io" target="_blank" rel="noopener noreferrer" className="hover:text-brand-600 transition-colors">
              Documentation
            </a>
            <a href="https://github.com/D4Vinci/Scrapling" target="_blank" rel="noopener noreferrer" className="hover:text-brand-600 transition-colors">
              GitHub
            </a>
            <a href="https://pypi.org/project/scrapling/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-600 transition-colors">
              PyPI
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
