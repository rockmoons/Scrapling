'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, Loader2, Copy, Check, Code2, Globe, FileCode, Trash2 } from 'lucide-react'

interface ScrapeResult {
  success: boolean
  error?: string
  data?: {
    url: string
    title: string
    method: 'url' | 'html'
    selector: string
    results: Array<{
      text: string
      html: string
      attributes: Record<string, string>
    }>
    count: number
  }
}

export default function PlaygroundPage() {
  const [mode, setMode] = useState<'url' | 'html'>('url')
  const [url, setUrl] = useState('')
  const [htmlInput, setHtmlInput] = useState('')
  const [selector, setSelector] = useState('h1')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScrapeResult | null>(null)
  const [copied, setCopied] = useState<number | null>(null)

  const handleScrape = async () => {
    setLoading(true)
    setResult(null)

    try {
      const body = mode === 'url'
        ? JSON.stringify({ url: url.trim(), selector: selector.trim() || 'h1' })
        : JSON.stringify({ html: htmlInput, selector: selector.trim() || 'h1' })

      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })

      const data: ScrapeResult = await res.json()
      setResult(data)
    } catch (err) {
      setResult({ success: false, error: 'Failed to connect to API' })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopied(index)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </Link>
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-brand-500" />
              <span className="font-bold text-lg">Scrapling Playground</span>
            </div>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
            Powered by Cheerio
          </span>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Mode Switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('url')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              mode === 'url'
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Globe className="w-4 h-4" />
            Fetch URL
          </button>
          <button
            onClick={() => setMode('html')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              mode === 'html'
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <FileCode className="w-4 h-4" />
            Parse HTML
          </button>
        </div>

        {/* Input Area */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* URL / HTML Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {mode === 'url' ? 'Website URL' : 'HTML Content'}
            </label>
            {mode === 'url' ? (
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="input-field pl-10"
                />
              </div>
            ) : (
              <textarea
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                placeholder="<html><body><h1>Hello World</h1></body></html>"
                rows={10}
                className="input-field font-mono text-sm resize-y"
              />
            )}
          </div>

          {/* CSS Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              CSS Selector
            </label>
            <input
              type="text"
              value={selector}
              onChange={(e) => setSelector(e.target.value)}
              placeholder="h1, .product, #main"
              className="input-field font-mono"
            />
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quick Examples
              </label>
              <div className="flex flex-wrap gap-2">
                {['h1', '.title', '#main', 'a::attr(href)', 'p::text', 'div.container'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelector(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      selector === s
                        ? 'bg-brand-100 text-brand-700 border border-brand-200'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleScrape}
            disabled={loading || (mode === 'url' ? !url.trim() : !htmlInput.trim())}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Scraping...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Scraper
              </>
            )}
          </button>
          <button
            onClick={() => {
              setResult(null)
              setUrl('')
              setHtmlInput('')
            }}
            className="btn-secondary"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Results{' '}
                {result.success && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({result.data?.count} match{result.data?.count !== 1 ? 'es' : ''})
                  </span>
                )}
              </h3>
            </div>

            {!result.success ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <p className="text-red-700 font-medium">Error</p>
                <p className="text-red-600 text-sm mt-1">{result.error}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {result.data?.results.map((item, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <span className="text-xs font-medium text-gray-500 font-mono">
                        Result #{i + 1}
                      </span>
                      <button
                        onClick={() => copyToClipboard(item.text || item.html, i)}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-600 transition-colors"
                      >
                        {copied === i ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-4 space-y-3">
                      {item.text && (
                        <div>
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Text</span>
                          <p className="text-gray-900 mt-1">{item.text}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">HTML</span>
                        <pre className="mt-1 text-xs bg-gray-50 rounded-lg p-3 overflow-x-auto text-gray-700">
                          {item.html}
                        </pre>
                      </div>
                      {item.attributes && Object.keys(item.attributes).length > 0 && (
                        <div>
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Attributes</span>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {Object.entries(item.attributes).map(([key, value]) => (
                              <span key={key} className="inline-flex items-center gap-1 px-2 py-1 bg-brand-50 text-brand-700 rounded-md text-xs font-mono">
                                <span className="font-semibold">{key}</span>
                                <span>=</span>
                                <span className="text-brand-500">&quot;{value}&quot;</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
