import { afterEach, describe, expect, it, vi } from 'vitest'

const navigator = { userAgent: '' }

afterEach(() => vi.unstubAllGlobals())

describe('device detection with UAParser 2', () => {
  it.each([
    {
      name: 'Android phone',
      userAgent:
        'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      mobile: true,
      android: true,
      ios: false,
    },
    {
      name: 'iPhone',
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      mobile: true,
      android: false,
      ios: true,
    },
    {
      name: 'iPad',
      userAgent:
        'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      mobile: true,
      android: false,
      ios: true,
    },
    {
      name: 'desktop',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      mobile: false,
      android: false,
      ios: false,
    },
  ])('recognizes $name', async ({ userAgent, mobile, android, ios }) => {
    navigator.userAgent = userAgent
    vi.stubGlobal('window', { navigator })
    const { isMobile, isAndroid, isIOS } = await import('./os')
    expect(isMobile()).toBe(mobile)
    expect(isAndroid()).toBe(android)
    expect(isIOS()).toBe(ios)
  })
})
