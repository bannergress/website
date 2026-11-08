// @vitest-environment jsdom
import { act, ReactNode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import AlgorithmDetectionChooser, {
  Algorithm,
} from '../algorithm-detection-chooser/AlgorithmDetectionChooser'
import AdvancedOptions from '../advanced-options/AdvancedOptions'
import { BannerType } from '../../features/banner/types'

vi.mock('../../api', () => ({ api: {} }))
vi.mock('../../i18n', () => ({ default: { t: (key: string) => key } }))
vi.mock('../../hooks/UserLoggedIn', () => ({
  useUserLoggedIn: () => ({ authenticated: false }),
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  Trans: ({ i18nKey }: { i18nKey: string }) => <>{i18nKey}</>,
}))
vi.mock('antd', () => ({
  Row: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Col: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Tooltip: ({ children }: { children: ReactNode }) => <>{children}</>,
  Slider: () => null,
}))

it('changes both creation-form choices with labelled toggle buttons without submitting', () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  const onSubmit = vi.fn((event: React.SubmitEvent<HTMLFormElement>) =>
    event.preventDefault()
  )
  const onAlgorithmChanged = vi.fn()
  const onOptionChanged = vi.fn()

  function Form() {
    const [algorithm, setAlgorithm] = useState<Algorithm>('advanced')
    const [type, setType] = useState<BannerType>('sequential')
    return (
      <form onSubmit={onSubmit}>
        <AlgorithmDetectionChooser
          selected={algorithm}
          loading={false}
          onChange={(value) => {
            onAlgorithmChanged(value)
            setAlgorithm(value)
          }}
        />
        <AdvancedOptions
          type={type}
          width={6}
          plannedOfflineDate={undefined}
          eventStartDate={undefined}
          eventEndDate={undefined}
          isEdit={false}
          onChange={(value, field) => {
            onOptionChanged(value, field)
            if (value === 'sequential' || value === 'anyOrder') setType(value)
          }}
        />
      </form>
    )
  }

  try {
    act(() => root.render(<Form />))
    const groups = container.querySelectorAll('.choice-buttons')
    expect(groups).toHaveLength(2)
    for (const group of groups) {
      expect(group.getAttribute('role')).toBe('group')
      const heading = document.getElementById(
        group.getAttribute('aria-labelledby')!
      )
      expect(heading?.textContent).toBeTruthy()
    }

    const buttons = container.querySelectorAll<HTMLButtonElement>(
      '.choice-buttons button'
    )
    expect(
      Array.from(buttons, (button) => button.getAttribute('aria-pressed'))
    ).toEqual(['false', 'true', 'true', 'false'])
    expect(Array.from(buttons, (button) => button.type)).toEqual([
      'button',
      'button',
      'button',
      'button',
    ])
    act(() => buttons[0].click())
    act(() => buttons[3].click())
    expect(onAlgorithmChanged).toHaveBeenCalledExactlyOnceWith('none')
    expect(onOptionChanged).toHaveBeenCalledExactlyOnceWith(
      'anyOrder',
      'bannerType'
    )
    expect(
      Array.from(buttons, (button) => button.getAttribute('aria-pressed'))
    ).toEqual(['true', 'false', 'false', 'true'])
    expect(onSubmit).not.toHaveBeenCalled()
  } finally {
    act(() => root.unmount())
    container.remove()
    vi.unstubAllGlobals()
  }
})
