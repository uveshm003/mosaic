import { describe, expect, it } from 'vitest'
import { seedRefusal } from './guard'

const dev = 'postgres://u:p@ep-dev-123.eu-central-1.aws.neon.tech/portfolio'
const prod = 'postgres://u:p@ep-main-456.eu-central-1.aws.neon.tech/portfolio'

describe('seedRefusal', () => {
  it('allows dev, demo and test', () => {
    for (const appEnv of ['dev', 'demo', 'test']) {
      expect(seedRefusal({ appEnv, databaseUrl: dev, productionDatabaseUrl: prod })).toBeNull()
    }
  })

  it('refuses APP_ENV=production', () => {
    expect(seedRefusal({ appEnv: 'production', databaseUrl: dev })).toMatch(/production/)
  })

  it('refuses unknown environments', () => {
    expect(seedRefusal({ appEnv: 'staging', databaseUrl: dev })).toMatch(/staging/)
  })

  it('refuses the production database host even with a dev APP_ENV', () => {
    const sameHost = prod.replace('/portfolio', '/other')
    expect(
      seedRefusal({ appEnv: 'dev', databaseUrl: sameHost, productionDatabaseUrl: prod }),
    ).toMatch(/production database/)
  })

  it('refuses an unparseable URL when a production URL is known', () => {
    expect(
      seedRefusal({ appEnv: 'dev', databaseUrl: 'not a url', productionDatabaseUrl: prod }),
    ).not.toBeNull()
  })
})
