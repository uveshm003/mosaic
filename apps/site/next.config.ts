import type { NextConfig } from 'next'

const config: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  transpilePackages: ['@mosaic/content', '@mosaic/tokens', '@mosaic/ui'],
}

export default config
