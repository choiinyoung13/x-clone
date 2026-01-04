interface Props {
  pageParam: number
}

export const getPostRecommends = async ({ pageParam }: Props) => {
  const res = await fetch(
    `/api/posts/recommends?cursor=${pageParam}&likes=0`,
    {
      next: { tags: ['posts', 'recommends'] },
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
