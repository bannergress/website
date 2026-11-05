import { FC, useEffect, useState } from 'react'
import { BannerFilter } from '../../features/banner/filter'
import {
  BannerFilterKey,
  loadBannerFilter,
  saveBannerFilter,
} from '../../features/banner/filterStorage'
import { useBannerList } from '../../features/banner/hooks'
import BannerList from '../banner-list'
import BannerOrderChooser from '../banner-order-chooser'

const InfiniteBannerList: FC<InfiniteBannerListProps> = ({
  initialFilter,
  filterKey,
  includeAddedList,
  includeRelevance,
  noResultsMessage,
}) => {
  const [filter, setFilter] = useState(() =>
    loadBannerFilter(filterKey, initialFilter)
  )
  const [maxPages, setMaxPages] = useState(1)
  const { status, data, hasMore } = useBannerList(filter, maxPages)

  const onFilterChanged = (newFilter: BannerFilter) => {
    saveBannerFilter(filterKey, newFilter)
    setFilter(newFilter)
    setMaxPages(1)
  }

  useEffect(() => {
    setFilter(loadBannerFilter(filterKey, initialFilter))
    setMaxPages(1)
  }, [filterKey, initialFilter])

  return (
    <div>
      <BannerOrderChooser
        filter={filter}
        onFilterChanged={onFilterChanged}
        includeAddedList={includeAddedList}
        includeRelevance={includeRelevance}
      />
      {status === 'resolved' && !data.length && !hasMore ? (
        noResultsMessage
      ) : (
        <BannerList
          banners={data}
          hasMoreBanners={hasMore}
          loadMoreBanners={() => {
            if (status === 'resolved') {
              setMaxPages(maxPages + 1)
            }
          }}
          applyBannerListStyles
          hideBlacklisted={false}
          showDetailsButton={false}
        />
      )}
    </div>
  )
}

export interface InfiniteBannerListProps {
  initialFilter: BannerFilter
  filterKey: BannerFilterKey
  includeAddedList?: boolean
  includeRelevance?: boolean
  includeSorting?: boolean
  includeOfficial?: boolean
  noResultsMessage?: string
}

export default InfiniteBannerList
