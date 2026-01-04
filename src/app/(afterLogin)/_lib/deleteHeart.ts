export const deleteHeart = async (id: number) => {
  const res = await fetch(
    `/api/posts/${id}/heart`,
    {
      method: 'delete',
      credentials: 'include',
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
