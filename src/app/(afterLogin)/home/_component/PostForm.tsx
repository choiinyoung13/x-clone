'use client'

import {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react'
import style from './postForm.module.css'
import { Session } from 'next-auth'
import TextareaAutosize from 'react-textarea-autosize'
import { useQueryClient } from '@tanstack/react-query'

interface Props {
  me: Session
}

export default function PostForm({ me }: Props) {
  const imageRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<Array<{ url: string; file: File }>>([])
  const [content, setContent] = useState('')
  const queryClient = useQueryClient()

  useEffect(() => {
    return () => {
      preview.forEach(item => URL.revokeObjectURL(item.url))
    }
  }, [])

  const onChange: ChangeEventHandler<HTMLTextAreaElement> = e => {
    setContent(e.target.value)
  }

  const onClickButton = () => {
    imageRef.current?.click()
  }

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
    e.preventDefault()
    const formData = new FormData()

    formData.append('content', content)
    preview.forEach(p => {
      p && formData.append('images', p.file)
    })

    try {
      const res = await fetch('/api/posts', {
        method: 'post',
        body: formData,
        credentials: 'include',
      })

      if (res.status === 201) {
        setPreview([])
        setContent('')
        queryClient.invalidateQueries({ queryKey: ['posts', 'recommends'] })
        queryClient.invalidateQueries({ queryKey: ['posts', 'followings'] })
        queryClient.invalidateQueries({ queryKey: ['trends'] })
      }
    } catch {
      alert('게시물 업로드 중 에러가 발생했습니다')
    }
  }

  return (
    <form className={style.postForm} onSubmit={onSubmit}>
      <div className={style.postUserSection}>
        <div className={style.postUserImage}>
          <img src={me?.user.image} alt={me?.user.name} />
        </div>
      </div>
      <div className={style.postInputSection}>
        <TextareaAutosize
          id="content"
          name="content"
          placeholder="무슨 일이 일어나고 있나요?"
          value={content}
          onChange={onChange}
        ></TextareaAutosize>
        <div className={style.previewSection}>
          {preview.length > 0 &&
            preview.map((image, i) => {
              return <img key={i} src={image.url} onClick={onRemoveImage(i)} />
            })}
        </div>
        <div className={style.postButtonSection}>
          <div className={style.footerButtons}>
            <div className={style.footerButtonLeft}>
              <input
                type="file"
                name="imageFiles"
                multiple
                hidden
                onChange={onUpload}
                ref={imageRef}
                accept="image/*"
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
      </div>
    </form>
  )
}
