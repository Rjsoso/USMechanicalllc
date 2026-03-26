import { memo } from 'react'
import { Navigate } from 'react-router-dom'

function CompanyBackground() {
  return <Navigate to="/about" replace />
}

export default memo(CompanyBackground)
