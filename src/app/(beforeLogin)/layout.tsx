import styles from '@/app/(beforeLogin)/_component/main.module.css'

export default function BeforeLoginLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <div className={styles.container}>
      {modal}
      {children}
    </div>
  )
}
