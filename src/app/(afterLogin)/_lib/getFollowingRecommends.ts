export async function getFollowingRecommends() {
  const res = await fetch(
    `/api/users/followRecommends`,
    {
      next: { tags: ['users', 'followRecommends'] },
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
