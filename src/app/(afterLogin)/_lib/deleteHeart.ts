export const deleteHeart = async (id: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}/heart`,
    {
      method: 'delete',
      credentials: 'include',
    }
  )
}
