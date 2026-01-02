import Link from 'next/link'
import style from './trend.module.css'
import type { Trend } from '@/model/Trend'

interface Props {
  trend: Trend
}

export default function Trend({ trend }: Props) {
  const title = trend.title.startsWith('#') ? trend.title.slice(1) : trend.title

  return (
    <Link href={`/search?q=${title}`} className={style.container}>
      <div className={style.count}>실시간트렌드</div>
      <div className={style.title}>{trend.title}</div>
      <div className={style.count}>{trend.count.toLocaleString()} posts</div>
    </Link>
  )
}
