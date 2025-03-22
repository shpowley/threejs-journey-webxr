import { useEffect, useState } from 'react'

const useForceUpdate = () => {
  const [, setRenderCount] = useState(0)
  return () => setRenderCount(prev => ++prev)
}

const ResizeListener = ({ onResize }) => {
  const handleResize = () => {
    if (typeof onResize === 'function')
      onResize()
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return null
}

export { ResizeListener, useForceUpdate }