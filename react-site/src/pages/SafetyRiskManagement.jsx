import { memo } from 'react'
import { Navigate } from 'react-router-dom'

function SafetyRiskManagement() {
  return <Navigate to="/about" replace />
}

export default memo(SafetyRiskManagement)
