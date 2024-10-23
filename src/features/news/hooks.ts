import { useEffect, useState } from 'react'
import { getNews } from './api'
import { NewsItem } from './types'

interface State {
  status: 'pending' | 'resolved' | 'rejected'
  data: NewsItem[]
}

export const useNewsList = function () {
  const [state, setState] = useState<State>({
    status: 'pending',
    data: [],
  })
  useEffect(() => {
    const fetchData = async () => {
      const response = await getNews()
      if (response.ok) {
        setState({
          status: 'resolved',
          data: response.data,
        })
      } else {
        setState({
          status: 'rejected',
          data: [],
        })
      }
    }
    fetchData()
  }, [setState])
  return state
}
