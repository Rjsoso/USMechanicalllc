import { motion } from 'framer-motion'

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <motion.div
          className="mx-auto mb-4 h-16 w-16 rounded-full border-4 border-blue-600 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="font-medium text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

export default Loading
