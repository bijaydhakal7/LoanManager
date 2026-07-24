import { GuestGuard } from "@/components/guest-guard";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuestGuard>
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#e0f2fe,#f8fafc_55%)] px-6 py-12">
        <div className="absolute inset-y-0 left-0 hidden w-1/2 bg-[linear-gradient(120deg,#eff6ff,#ecfeff)] md:block" />
        <div className="relative z-10 flex w-full flex-col items-center gap-10">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-600">Loan Manager</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Build a clear financial path.</h1>
            <p className="mt-2 text-sm text-slate-500">
              Track loans, expenses, and interest with the clarity of a modern finance dashboard.
            </p>
          </div>
          {children}
        </div>
      </div>
    </GuestGuard>
  );
}
