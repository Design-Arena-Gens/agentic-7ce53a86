import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Everest Summit - Cinematic Journey',
  description: 'A cinematic experience of reaching Mount Everest summit',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
