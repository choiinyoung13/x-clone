export const addRepost = async (id: number) => {
  const res = await fetch(
    `/api/posts/${id}/reposts`,
    {
      method: 'post',
      credentials: 'include',
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
}
