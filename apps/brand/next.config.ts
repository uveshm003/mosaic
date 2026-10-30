import type { NextConfig } from 'next'

const config: NextConfig = {
  output: 'export',
  // Served under /brand on uveshm003.github.io (ADR 0002).
  basePath: '/brand',
  agentRules: false,
  images: { unoptimized: true },
  transpilePackages: ['@mosaic/content', '@mosaic/tokens', '@mosaic/ui'],
}

export default config
