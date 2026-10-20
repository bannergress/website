// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import BannerPicture from './BannerPicture'

vi.mock('antd', () => ({ Button: 'button', Modal: () => null }))
vi.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: () => {}, inView: true }),
}))

describe('BannerPicture image loading', () => {
  let container: HTMLDivElement
  let root: Root
  const cancel = vi.fn()
  const animate = vi.fn(() => ({ cancel }))

  beforeEach(() => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    vi.stubGlobal('matchMedia', () => ({ matches: false }))
    vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(
      false
    )
    vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(
      0
    )
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(160)
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(400)
    Object.defineProperty(HTMLElement.prototype, 'animate', {
      configurable: true,
      value: animate,
    })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    delete (HTMLElement.prototype as Partial<HTMLElement>).animate
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  const render = (url = '/banner.png', size = 6) => {
    act(() => root.render(<BannerPicture url={url} size={size} lines={8} />))
    return container.querySelector('img')!
  }

  const finishLoading = (image: HTMLImageElement) => {
    vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(
      true
    )
    vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(
      600
    )
    act(() => {
      image.dispatchEvent(new Event('load'))
    })
  }

  it.each([3, 6])(
    'keeps the original image after a delayed load for a %i-column banner',
    (size) => {
      const image = render('/banner.png', size)
      expect(animate).not.toHaveBeenCalled()

      finishLoading(image)

      expect(container.querySelector('img')).toBe(image)
      expect(animate).toHaveBeenCalledOnce()
      expect(animate.mock.calls[0]).toEqual([
        expect.arrayContaining([
          expect.objectContaining({ transform: 'translateY(-240px)' }),
        ]),
        expect.objectContaining({ iterations: Infinity }),
      ])
    }
  )

  it('recognizes an image that was loaded from cache before the effect', () => {
    vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(
      true
    )
    vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(
      600
    )

    const image = render()

    expect(container.querySelector('img')).toBe(image)
    expect(animate).toHaveBeenCalledOnce()
  })

  it('waits for a replacement URL to load and cancels the previous animation', () => {
    const image = render()
    finishLoading(image)

    vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(
      false
    )
    vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(
      0
    )
    expect(render('/another-banner.png')).toBe(image)
    expect(cancel).toHaveBeenCalledOnce()
    expect(animate).toHaveBeenCalledOnce()

    finishLoading(image)

    expect(animate).toHaveBeenCalledTimes(2)
  })

  it('does not animate a failed image even when complete is true', () => {
    const image = render()
    vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(
      true
    )

    act(() => {
      image.dispatchEvent(new Event('error'))
    })

    expect(animate).not.toHaveBeenCalled()
    expect(container.querySelector('img')).toBe(image)
  })

  it('respects reduced motion after loading', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    const image = render()

    finishLoading(image)

    expect(animate).not.toHaveBeenCalled()
  })
})
