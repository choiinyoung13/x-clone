import style from './chatRoom.module.css'
import cx from 'classnames'
import 'dayjs/locale/ko'
import dayjs from 'dayjs'

export default function MessageList({ messages }) {
  return (
    <div className={style.list}>
      {messages.map(m => {
        if (m.id === 'zerohch0') {
          // 내 메시지면
          return (
            <div
              key={m.messageId}
              className={cx(style.message, style.myMessage)}
            >
              <div className={style.content}>{m.content}</div>
              <div className={style.date}>
                {dayjs(m.createdAt).format('YYYY년 MM월 DD일 A HH시 mm분')}
              </div>
            </div>
          )
        }
        return (
          <div
            key={m.messageId}
            className={cx(style.message, style.yourMessage)}
          >
            <div className={style.content}>{m.content}</div>
            <div className={style.date}>
              {dayjs(m.createdAt).format('YYYY년 MM월 DD일 A HH시 mm분')}
            </div>
          </div>
        )
      })}
    </div>
  )
}
