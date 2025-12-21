import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from '@tanstack/react-query'
import TabDecider from './TabDecider'
import { getPostRecommends } from '../_lib/getPostRecommends'

export default async function TabDeciderSuspense() {
  const queryClient = new QueryClient()
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['posts', 'recommends'],
    queryFn: getPostRecommends,
    initialPageParam: 0,
  })
  const dehydrateState = dehydrate(queryClient)

  return (
    <HydrationBoundary state={dehydrateState}>
      <TabDecider />
    </HydrationBoundary>
  )
}
