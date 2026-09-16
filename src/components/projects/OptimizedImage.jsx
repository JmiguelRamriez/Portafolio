import { useState } from 'react'

/**
 * OptimizedImage — loads pre-optimized WebP from public/images/optimized/
 * Handles blur-up transition and class forwarding for Project.css selectors.
 */
export default function OptimizedImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  onLoad,
  ...props
}) {
  const [imgLoaded, setImgLoaded] = useState(false)

  function handleLoad() {
    setImgLoaded(true)
    onLoad?.()
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      onLoad={handleLoad}
      className={`${className} ${imgLoaded ? 'img-loaded' : ''}`}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
      }}
      {...props}
    />
  )
}
