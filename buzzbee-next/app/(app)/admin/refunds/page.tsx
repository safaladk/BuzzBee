export default function AdminRefundsPage() {
  return (
    <div className="p-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Refund Requests
          </h1>
          <p className="text-slate-500 text-sm">
            Manage attendee booking refunds, process payouts, and handle financial operations safely.
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
        <h3 className="text-lg font-bold text-slate-700 mb-2">Dedicated Refund Workspace Coming Soon</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          Currently, pending refunds can be approved directly on the main Dashboard overview page. This page will soon support detailed financial records and mass actions.
        </p>
      </div>
    </div>
  );
}
