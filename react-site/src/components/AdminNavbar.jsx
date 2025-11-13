import { Link } from 'react-router-dom'

function AdminNavbar({ onLogout }) {
  return (
    <nav className="bg-gray-900 px-6 py-4 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="text-xl font-bold">U.S. Mechanical Admin</div>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="rounded-lg bg-blue-600 px-4 py-2 transition-all hover:bg-blue-700"
          >
            View Website
          </Link>
          <button
            onClick={onLogout}
            className="rounded-lg bg-red-600 px-4 py-2 transition-all hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default AdminNavbar
