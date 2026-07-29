export default function DashboardLoading() {
  return (
    <main className="max-w-5xl mx-auto p-8 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-40 bg-gray-200 rounded" />
        <div className="h-10 w-32 bg-gray-200 rounded-md" />
      </div>
      <div className="h-10 w-full max-w-md bg-gray-200 rounded-md mb-6" />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-gray-200 rounded mb-3" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 border rounded-md bg-gray-100" />
          ))}
        </div>
        <div className="space-y-2">
          <div className="h-6 w-32 bg-gray-200 rounded mb-3" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 border rounded-md bg-gray-100" />
          ))}
        </div>
      </div>
    </main>
  )
}