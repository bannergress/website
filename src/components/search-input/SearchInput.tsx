import React, { Fragment, FC } from 'react'
import { Input } from 'antd'

import './search-input.less'

const { Search } = Input

const SearchInput: FC<SearchInputProps> = ({ autoFocus, onSearch }) => {
  return (
    <Fragment>
      <Search
        placeholder="Search Banners or Places"
        onSearch={onSearch}
        enterKeyHint="search"
        type="search"
        className="search-input"
        autoFocus={autoFocus || false}
      />
    </Fragment>
  )
}

export interface SearchInputProps {
  autoFocus?: boolean
  onSearch: (searchTerm: string) => void
}

export default SearchInput
