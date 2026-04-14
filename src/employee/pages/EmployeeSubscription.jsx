import { subscriptionPlans } from '../data/mockData';

const EmployeeSubscription = () => {
  return (
    <div className="space-y-5">
      <section className="glass-card p-5">
        <h2 className="employee-heading text-slate-100 text-lg">Current Plan</h2>
        <div className="mt-3 flex flex-wrap gap-3 items-center">
          <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-200 border border-cyan-400/35">Pro - Active</span>
          <p className="text-slate-300">Renewal: 2026-05-14</p>
        </div>
        <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-cyan-400 to-violet-500" />
        </div>
        <p className="text-xs text-slate-400 mt-2">25 of 50 cases used this month</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subscriptionPlans.map((plan) => (
          <article key={plan.name} className={`glass-card p-4 ${plan.highlight ? 'border-cyan-300/45 shadow-[0_0_16px_rgba(0,212,255,.25)]' : ''}`}>
            <h3 className="employee-heading text-slate-100">{plan.name}</h3>
            <p className="text-2xl text-cyan-200 mt-2">{plan.price}</p>
            <p className="text-sm text-slate-400 mt-2">Limit: {plan.limit} cases/month</p>
          </article>
        ))}
      </section>

      <section className="glass-card overflow-hidden">
        <div className="px-4 py-3 border-b border-cyan-400/10">
          <h3 className="employee-heading text-slate-100">Payment History</h3>
        </div>
        <table className="w-full">
          <thead className="text-left text-xs text-slate-400">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Plan</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Invoice</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-cyan-400/10">
              <td className="p-3 text-slate-300">2026-04-01</td>
              <td className="p-3 text-slate-300">Pro</td>
              <td className="p-3 text-slate-300">$199</td>
              <td className="p-3 text-slate-300">Paid</td>
              <td className="p-3 text-cyan-300">Download</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default EmployeeSubscription;
