interface Props {
  pageParam: number
}

export async function getFollowingPost({ pageParam }: Props) {
  const res = await fetch(
    `/api/posts/followings?cursor=${pageParam}`,
    {
      next: { tags: ['posts', 'followings'] },
      credentials: 'include',
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
