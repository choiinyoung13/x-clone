export const addHeart = async (id: number) => {
  const res = await fetch(
    `/api/posts/${id}/heart`,
    {
      method: 'post',
      credentials: 'include',
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
