import { useEditMode } from '../context/EditModeContext'

function EditModeBanner() {
  const { editMode } = useEditMode()

  if (!editMode) return null

  return (
    <div className="fixed top-0 w-full bg-blue-600 text-white text-center py-2 text-sm z-50">
      ✏️ Edit Mode Active — Changes will be saved locally.
    </div>
  )
}

export default EditModeBanner

