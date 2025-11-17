'use client'

import { useEffect } from 'react'
import Script from 'next/script'

// Declare gtag on window object
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

export default function Analytics() {
  useEffect(() => {
    // Only run on client side
    if (typeof window.gtag === 'undefined') return
    
    // Simple pageview - no search params tracking
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      page_path: window.location.pathname,
      page_title: document.title,
      page_location: window.location.href,
    })
  }, []) // Empty dependency array - run once on mount

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `,
        }}
      />
    </>
  )
}