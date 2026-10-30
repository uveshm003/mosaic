import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const config: NextConfig = {
  agentRules: false,
  transpilePackages: ['@mosaic/content'],
}

export default withPayload(config, { devBundleServerPackages: false })
