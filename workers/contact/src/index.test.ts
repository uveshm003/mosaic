import { describe, expect, it } from 'vitest'
import worker from './index'

describe('contact worker', () => {
  it('responds 501 until the contract is implemented', () => {
    expect(worker.fetch().status).toBe(501)
  })
})
