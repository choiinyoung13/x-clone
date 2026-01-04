export async function getTrends() {
  const res = await fetch(
    `/api/hashtags/trends`,
    {
      next: { tags: ['trends'] },
      credentials: 'include',
    }
  )
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}
