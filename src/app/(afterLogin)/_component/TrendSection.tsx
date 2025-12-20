'use client'

import { usePathname } from 'next/navigation'
import style from './trendSection.module.css'
import Trend from '@/app/(afterLogin)/_component/Trend'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { getTrends } from '../_lib/getTrends'
import type { Trend as ITrend } from '@/model/Trend'

export default function TrendSection() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const { data: trends } = useQuery<ITrend[]>({
    queryKey: ['trends'],
    queryFn: getTrends,
    staleTime: 60 * 1000,
    gcTime: 60 * 5000,
    enabled: !!session?.user,
  })

  if (pathname === '/explore') {
    return null
  }

  if (session) {
    return (
      <div className={style.trendBg}>
        <div className={style.trend}>
          <h3>나를 위한 트렌드</h3>
          {trends?.map(trend => (
            <Trend key={trend.tagId} trend={trend} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={style.trendBg}>
      <div className={style.noTrend}>트렌드를 가져올 수 없습니다.</div>
    </div>
  )
}
