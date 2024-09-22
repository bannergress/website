import { FC, useEffect, useState } from 'react'
import { BannerFilter } from '../../features/banner/filter'
import { useBannerList } from '../../features/banner/hooks'
import BannerList from '../banner-list'
import BannerOrderChooser from '../banner-order-chooser'

const InfiniteBannerList: FC<InfiniteBannerListProps> = ({
  initialFilter,
  includeAddedList,
  includeRelevance,
  noResultsMessage,
}) => {
  const [filter, setFilter] = useState(initialFilter)
  const [maxPages, setMaxPages] = useState(1)
  const { status, data, hasMore } = useBannerList(filter, maxPages)

  const onFilterChanged = (newFilter: BannerFilter) => {
    setFilter(newFilter)
    setMaxPages(1)
  }

  useEffect(() => {
    onFilterChanged(initialFilter)
  }, [initialFilter])

  return (
    <div>
      <BannerOrderChooser
        filter={filter}
        onFilterChanged={onFilterChanged}
        includeAddedList={includeAddedList}
        includeRelevance={includeRelevance}
      />
      {status === 'resolved' && !data.length ? (
        noResultsMessage
      ) : (
        <BannerList
          banners={data}
          hasMoreBanners={hasMore}
          loadMoreBanners={async () => {
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
  includeAddedList?: boolean
  includeRelevance?: boolean
  includeSorting?: boolean
  includeOfficial?: boolean
  noResultsMessage?: string
}

export default InfiniteBannerList
