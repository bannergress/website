import React, { FormEvent, Fragment, FC, useRef } from 'react'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'

import { ReactComponent as SVGSearch } from '../../img/icons/search.svg'

import './search-input.less'

const SearchInput: FC<SearchInputProps> = ({ autoFocus, onSearch }) => {
  const textInput = useRef<HTMLInputElement>(null)
  const { t } = useTranslation(undefined, { keyPrefix: 'search' })

  const handleClick = (e: FormEvent) => {
    e.preventDefault()

    const term = (textInput.current?.value || '').trim()

    //  Improve search for non-latin scripts #256
    const byteLength = new Blob([term]).size

    if (byteLength >= 3) {
      // When we set focus to the input automatically (i.e. on mobile),
      // also remove it automatically after executing search so that the
      // virtual keyboard closes
      if (autoFocus) {
        textInput.current?.blur()
      }

      onSearch(term)
    } else {
      message.info(t('errors.short'), 1)
    }
  }

  return (
    <Fragment>
      <form className="search-input-form" name="search" onSubmit={handleClick}>
        <input
          placeholder={t('placeholder')}
          enterKeyHint="search"
          type="search"
          className="search-input"
          maxLength={200}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus || false}
          ref={textInput}
        />
        <button className="search-input-button" type="submit">
          <SVGSearch className="search-input-icon" />
        </button>
      </form>
    </Fragment>
  )
}

export interface SearchInputProps {
  autoFocus?: boolean
  onSearch: (searchTerm: string) => void
}

export default SearchInput
