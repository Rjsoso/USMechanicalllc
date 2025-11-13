import { createContext, useContext, useState } from 'react'

const EditModeContext = createContext()

export function EditModeProvider({ children }) {
  const [editMode, setEditMode] = useState(false)

  const toggleEditMode = () => {
    setEditMode(prev => !prev)
  }

  return (
    <EditModeContext.Provider value={{ editMode, toggleEditMode, setEditMode }}>
      {children}
    </EditModeContext.Provider>
  )
}

export function useEditMode() {
  const context = useContext(EditModeContext)
  if (!context) {
    throw new Error('useEditMode must be used within an EditModeProvider')
  }
  return context
}

