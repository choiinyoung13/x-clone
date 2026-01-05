export const deleteRepost = async (id: number) => {
  try {
    const res = await fetch(
      `/api/posts/${id}/reposts`,
      {
        method: 'delete',
        credentials: 'include',
      }
    )

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: '알 수 없는 오류가 발생했습니다.' }))
      throw new Error(errorData.message || `서버 오류: ${res.status}`)
    }

    return res.text()
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('네트워크 연결을 확인해주세요.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('재게시 취소 처리 중 오류가 발생했습니다.')
  }
}
