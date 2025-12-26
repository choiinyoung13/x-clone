'use client'

import { useRouter } from 'next/navigation'
import style from './modal.module.css'
import {
  ChangeEventHandler,
  FormEvent,
  FormEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useSession } from 'next-auth/react'
import { useModalStore } from '@/store/modal'
import Post from '../../../../(afterLogin)/_component/Post'
import TextareaAutosize from 'react-textarea-autosize'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function TweetModal() {
  const [content, setContent] = useState('')
  const imageRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<Array<{ url: string; file: File }>>([])
  const router = useRouter()
  const { data: me } = useSession()
  const modalStore = useModalStore()
  const queryClient = useQueryClient()

  const parent = modalStore.data

  const addPost = useMutation({
    mutationFn: async (e: FormEvent) => {
      e.preventDefault()
      const formData = new FormData()

      formData.append('content', content)
      preview.forEach(p => {
        p && formData.append('images', p.file)
      })

      return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
        method: 'post',
        body: formData,
        credentials: 'include',
      })
    },
    onSuccess: () => {
      setPreview([])
      setContent('')
      queryClient.invalidateQueries({ queryKey: ['posts', 'recommends'] })
      queryClient.invalidateQueries({ queryKey: ['posts', 'followings'] })
      queryClient.invalidateQueries({ queryKey: ['trends'] })
      router.back()
      modalStore.reset()
    },
    onError: () => {
      alert('게시물 업로드 중 에러가 발생했습니다')
    },
  })
  const comment = useMutation({
    mutationFn: async (e: FormEvent) => {
      e.preventDefault()
      const formData = new FormData()

      formData.append('content', content)
      preview.forEach(p => {
        p && formData.append('images', p.file)
      })

      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${parent.postId}/comments`,
        {
          method: 'post',
          body: formData,
          credentials: 'include',
        }
      )
    },
    onSuccess: () => {
      setPreview([])
      setContent('')
      queryClient.invalidateQueries({ queryKey: ['posts', 'recommends'] })
      queryClient.invalidateQueries({ queryKey: ['posts', 'followings'] })
      queryClient.invalidateQueries({ queryKey: ['trends'] })
      router.back()
      modalStore.reset()
    },
    onError: () => {
      alert('게시물 업로드 중 에러가 발생했습니다')
    },
  })

  useEffect(() => {
    return () => {
      preview.forEach(item => URL.revokeObjectURL(item.url))
    }
  }, [])

  const onRemoveImage = (index: number) => () => {
    setPreview(prev => prev.filter((_, i) => i !== index))
  }

  const onUpload: ChangeEventHandler<HTMLInputElement> = e => {
    e.preventDefault()

    if (!e.target.files) return

    const files = Array.from(e.target.files)

    if (files.length > 4) {
      alert('이미지는 최대 4개까지만 업로드할 수 있습니다.')
      e.target.value = '' // input 초기화
      return
    }
    preview?.forEach(item => URL.revokeObjectURL(item.url))
    const updated = files.map(file => {
      const url = URL.createObjectURL(file)
      return { url, file }
    })

    setPreview(updated)
  }

  const onSubmit: FormEventHandler = async e => {
    if (modalStore.mode === 'new') {
      addPost.mutate(e)
    } else {
      comment.mutate(e)
    }
  }
  const onClickClose = () => {
    router.back()
    modalStore.reset()
  }
  const onClickButton = () => {
    imageRef.current?.click()
  }
  const onChangeContent: ChangeEventHandler<HTMLTextAreaElement> = e => {
    setContent(e.target.value)
  }

  return (
    <div className={style.modalBackground}>
      <div className={style.modal}>
        {modalStore.mode === 'comment' && <Post post={parent} noImage />}

        <button className={style.closeButton} onClick={onClickClose}>
          <svg
            width={24}
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="r-18jsvk2 r-4qtqp9 r-yyyyoo r-z80fyv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-19wmn03"
          >
            <g>
              <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
            </g>
          </svg>
        </button>
        <form className={style.modalForm} onSubmit={onSubmit}>
          <div className={style.modalBody}>
            <div className={style.postUserSection}>
              <div className={style.postUserImage}>
                <img src={me?.user?.image} alt={me?.user?.id} />
              </div>
            </div>
            <div className={style.inputDiv}>
              <TextareaAutosize
                className={style.input}
                placeholder={
                  modalStore.mode === 'new'
                    ? '무슨 일이 일어나고 있나요?'
                    : '답글 게시하기'
                }
                value={content}
                onChange={onChangeContent}
              />
              <div className={style.previewSection}>
                {preview.length > 0 &&
                  preview.map((image, i) => {
                    return (
                      <img key={i} src={image.url} onClick={onRemoveImage(i)} />
                    )
                  })}
              </div>
            </div>
          </div>
          <div className={style.modalFooter}>
            <div className={style.modalDivider} />
            <div className={style.footerButtons}>
              <div className={style.footerButtonLeft}>
                <input
                  type="file"
                  name="imageFiles"
                  multiple
                  hidden
                  onChange={onUpload}
                  ref={imageRef}
                />
                <button
                  className={style.uploadButton}
                  type="button"
                  onClick={onClickButton}
                >
                  <svg width={24} viewBox="0 0 24 24" aria-hidden="true">
                    <g>
                      <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
                    </g>
                  </svg>
                </button>
              </div>
              <button className={style.actionButton} disabled={!content}>
                게시하기
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
