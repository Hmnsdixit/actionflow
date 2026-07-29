import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1E2761',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, color: 'white', marginBottom: 20 }}>
          ActionFlow
        </div>
        <div style={{ fontSize: 28, color: '#CADCFC', maxWidth: 800, textAlign: 'center' }}>
          Turn messy meeting notes into organized action — automatically.
        </div>
      </div>
    ),
    { ...size }
  )
}