export const KPICard = ({ title, value, icon, trend }: { title: string; value: number; icon: React.ReactNode; trend?: string }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
                {trend && <p className="text-xs text-emerald-600 mt-1">{trend}</p>}
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                {icon}
            </div>
        </div>
    </div>
);