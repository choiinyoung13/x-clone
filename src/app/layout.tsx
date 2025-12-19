import AuthSession from './_component/AuthSession'
import { MSWProvider } from './_component/MSWComponent'
import './globals.css'

if (
  process.env.NEXT_RUNTIME == 'nodejs' &&
  process.env.NODE_ENV !== 'production'
) {
  const { server } = require('@/mocks/http')
  server.listen()
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <MSWProvider>
          <AuthSession>{children}</AuthSession>
        </MSWProvider>
      </body>
    </html>
  )
}
