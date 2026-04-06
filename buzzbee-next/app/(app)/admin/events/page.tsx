export default function AdminEventsPage() {
  return (
    <div className="p-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Events Management
          </h1>
          <p className="text-slate-500 text-sm">
            Manage all events across the platform. Update or remove listings.
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
        <h3 className="text-lg font-bold text-slate-700 mb-2">Events Dashboard Coming Soon</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          The comprehensive events table and advanced filtering capabilities will be rendered here.
        </p>
      </div>
    </div>
  );
}
