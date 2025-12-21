interface Props {
  pageParam: number
}

export const getPostRecommends = async ({ pageParam }: Props) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/postRecommends?cursor=${pageParam}`,
    {
      next: { tags: ['posts', 'recommends'] },
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
