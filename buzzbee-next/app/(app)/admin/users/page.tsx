export default function AdminUsersPage() {
  return (
    <div className="p-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            User Accounts
          </h1>
          <p className="text-slate-500 text-sm">
            Manage attendees, organizers, and their associated data.
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
        <h3 className="text-lg font-bold text-slate-700 mb-2">Users Dashboard Coming Soon</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          User search, role assignments, and ban functionality will be available here.
        </p>
      </div>
    </div>
  );
}
