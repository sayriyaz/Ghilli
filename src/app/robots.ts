import type { MetadataRoute } from 'next'

const SITE_URL = 'https://ghilligolisoda.com'

// AI / answer-engine crawlers we explicitly welcome (AEO / GEO)
const AI_BOTS = [
  'GPTBot',            // OpenAI / ChatGPT
  'OAI-SearchBot',     // OpenAI search
  'ChatGPT-User',      // ChatGPT browsing
  'ClaudeBot',         // Anthropic
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',     // Perplexity
  'Perplexity-User',
  'Google-Extended',   // Google Gemini / AI Overviews
  'Applebot',          // Apple / Siri
  'Applebot-Extended',
  'Amazonbot',
  'Bytespider',        // TikTok / Doubao
  'CCBot',             // Common Crawl (feeds many LLMs)
  'meta-externalagent', // Meta AI
  'cohere-ai',
  'DuckAssistBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Everyone (search engines + anything else)
      { userAgent: '*', allow: '/' },
      // Explicitly allow each AI crawler so intent is unambiguous
      ...AI_BOTS.map((bot) => ({ userAgent: bot, allow: '/' })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
