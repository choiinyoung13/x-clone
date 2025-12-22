'use client'

import { useQuery } from '@tanstack/react-query'
import { getTrends } from '../../_lib/getTrends'
import type { Trend as ITrend } from '@/model/Trend'
import Trend from '../../_component/Trend'

export default function TrendSection() {
  const { data } = useQuery<ITrend[]>({
    queryKey: ['trends'],
    queryFn: getTrends,
  })

  return data?.map(trend => (
    <Trend key={trend.title + trend.tagId} trend={trend} />
  ))
}
