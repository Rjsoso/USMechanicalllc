import { memo } from 'react'
import { Navigate } from 'react-router-dom'

function Recognition() {
  return <Navigate to="/about" replace />
}

export default memo(Recognition)
