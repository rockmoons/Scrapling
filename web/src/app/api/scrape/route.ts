import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export const runtime = 'nodejs'

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return 'https://' + trimmed
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, html, selector } = body

    if (!selector || typeof selector !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please provide a CSS selector' },
        { status: 400 }
      )
    }

    let htmlContent: string
    let sourceUrl = ''
    let method: 'url' | 'html' = 'html'

    if (url) {
      method = 'url'
      sourceUrl = normalizeUrl(url)
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000)

        const response = await fetch(sourceUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml',
            'Accept-Language': 'en-US,en;q=0.5',
          },
          signal: controller.signal,
          redirect: 'follow',
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          return NextResponse.json(
            { success: false, error: `HTTP ${response.status}: Failed to fetch the URL` },
            { status: 400 }
          )
        }

        const contentType = response.headers.get('content-type') || ''
        if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
          return NextResponse.json(
            { success: false, error: 'URL does not return HTML content' },
            { status: 400 }
          )
        }

        htmlContent = await response.text()
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return NextResponse.json(
            { success: false, error: 'Request timed out after 15 seconds' },
            { status: 400 }
          )
        }
        return NextResponse.json(
          { success: false, error: `Failed to fetch URL: ${getErrorMessage(err)}` },
          { status: 400 }
        )
      }
    } else if (html) {
      htmlContent = html
      method = 'html'
    } else {
      return NextResponse.json(
        { success: false, error: 'Please provide a URL or HTML content' },
        { status: 400 }
      )
    }

    // Parse with Cheerio
    const $ = cheerio.load(htmlContent)
    const title = $('title').text() || 'No title'

    // Execute CSS selector
    let elements: cheerio.Cheerio<any>
    try {
      elements = $(selector)
    } catch {
      return NextResponse.json(
        { success: false, error: `Invalid CSS selector: "${selector}"` },
        { status: 400 }
      )
    }

    const results: Array<{
      text: string
      html: string
      attributes: Record<string, string>
    }> = []

    elements.each((_i: number, el: cheerio.AnyNode) => {
      const $el = $(el)
      const attrs: Record<string, string> = {}

      if (el.type === 'tag') {
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        const attribs = (el as any).attribs || {}
        for (const [key, value] of Object.entries(attribs)) {
          attrs[key] = String(value)
        }
      }

      results.push({
        text: $el.text().trim().substring(0, 2000),
        html: $.html(el).trim().substring(0, 5000),
        attributes: attrs,
      })
    })

    return NextResponse.json({
      success: true,
      data: {
        url: sourceUrl,
        title,
        method,
        selector,
        results,
        count: results.length,
      },
    })
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: `Server error: ${getErrorMessage(err)}` },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
