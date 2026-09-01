export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the i10 Group Portal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-500 uppercase">Total Practices</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">--</div>
          <p className="text-sm text-gray-600 mt-2">Loading...</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-500 uppercase">Pending Claims</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">--</div>
          <p className="text-sm text-gray-600 mt-2">Loading...</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-500 uppercase">Urgent Follow-ups</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">--</div>
          <p className="text-sm text-gray-600 mt-2">Loading...</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <p className="text-gray-600">No recent activity to display</p>
        </div>
      </div>
    </div>
  )
}
