export const getUser = async ({ queryKey }) => {
  const [_1, username] = queryKey

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}`,
    {
      next: { tags: ['user', username] },
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
