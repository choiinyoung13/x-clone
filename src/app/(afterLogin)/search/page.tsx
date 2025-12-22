import style from './search.module.css'
import SearchForm from '@/app/(afterLogin)/_component/SearchForm'
import { Metadata } from 'next'
import BackButton from '../_component/BackButton'
import Tab from './_component/Tab'
import SearchResult from './_component/SearchResult'
import { Suspense } from 'react'
import Loading from '../home/loading'

type Props = {
  searchParams: { q: string; f?: string; pf?: string }
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const search = await searchParams

  return {
    title: `${search.q} - 검색 / Z`,
    description: `${search.q} - 검색 / Z`,
  }
}

export default async function Search({ searchParams }: Props) {
  const params = await searchParams

  return (
    <main className={style.main}>
      <div className={style.searchTop}>
        <div className={style.searchZone}>
          <div className={style.buttonZone}>
            <BackButton />
          </div>
          <div className={style.formZone}>
            <SearchForm q={params.q} />
          </div>
        </div>
        <Tab />
      </div>
      <div className={style.list}>
        <Suspense fallback={<Loading />}>
          <SearchResult searchParams={params} />
        </Suspense>
      </div>
    </main>
  )
}
