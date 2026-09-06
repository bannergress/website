import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { PageTitle } from './PageTitle'

describe('PageTitle', () => {
  it('preserves the site title template with React 19 metadata', () => {
    expect(renderToStaticMarkup(<PageTitle title="Map" />)).toBe(
      '<title>Map - Bannergress</title>'
    )
  })

  it('uses the site name while a page title is loading', () => {
    expect(renderToStaticMarkup(<PageTitle />)).toBe(
      '<title>Bannergress</title>'
    )
  })
})
