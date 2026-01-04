export const deleteRepost = async (id: number) => {
  const res = await fetch(
    `/api/posts/${id}/reposts`,
    {
      method: 'delete',
      credentials: 'include',
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.text()
}
