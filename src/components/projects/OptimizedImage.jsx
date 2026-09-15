import { useState } from 'react'

/**
 * OptimizedImage - Wrapper around <picture> element for responsive WebP/AVIF images
 * Generates source sets for multiple widths from the optimized images directory
 */
export default function OptimizedImage({ 
  src, 
  alt, 
  className, 
  loading = 'lazy', 
  onLoad, 
  ...props 
}) {
  const [imgLoaded, setImgLoaded] = useState(false)
  
  // SVG or non-optimized: render plain img (e.g., clase-notes SVGs)
  if (src.endsWith('.svg')) {
    return (
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={() => { setImgLoaded(true); onLoad?.() }}
        className={className}
        style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
        {...props}
      />
    )
  }

  // Extract base + width from optimized path e.g. "PCB_allwinner-800w.webp" -> base "PCB_allwinner", width "800"
  const filename = src.split('/').pop() || ''
  const match = filename.match(/^(.+)-(\d+)w\.webp$/)
  const baseName = match ? match[1] : filename.replace(/\.webp$/, '')
  const width = match ? match[2] : '800'
  const avifSrc = src.replace(/-\d+w\.webp$/, `-${width}w.avif`).replace('/optimized/', '/optimized/')
  
  function handleLoad() {
    setImgLoaded(true)
    onLoad?.()
  }
  
  return (
    <picture className={className} style={{ display: 'contents' }}>
      <source srcSet={avifSrc} type="image/avif" />
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={handleLoad}
        style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s ease', width: '100%', height: '100%', objectFit: 'cover' }}
        {...props}
      />
    </picture>
  )
}