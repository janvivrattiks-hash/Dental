import { useEffect, useState } from 'react';
import api from '../../Script/api';

const EmployeeSubscription = () => {
  const [planData, setPlanData] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const [myPlanRes, plansRes] = await Promise.all([
          api.employee.subscription.myPlan(),
          api.employee.subscription.plans(),
        ]);
        if (!mounted) return;
        setPlanData(myPlanRes.data?.data || null);
        setPlans(plansRes.data?.data || []);
      } catch {
        // fall back to empty
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  const usedPercent = planData
    ? planData.cases_limit === -1
      ? 20
      : Math.min(100, Math.round((planData.cases_used_this_month / planData.cases_limit) * 100))
    : 0;

  return (
    <div className="space-y-5">
      <section className="glass-card p-5">
        <h2 className="employee-heading text-slate-100 text-lg">Current Plan</h2>
        {loading ? (
          <p className="text-slate-400 mt-3 text-sm">Loading plan...</p>
        ) : planData ? (
          <>
            <div className="mt-3 flex flex-wrap gap-3 items-center">
              <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-200 border border-cyan-400/35">
                {planData.display_name} - {planData.status}
              </span>
            </div>
            <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{ width: `${usedPercent}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {planData.cases_used_this_month} of{' '}
              {planData.cases_limit === -1 ? 'unlimited' : planData.cases_limit} cases used this month
              {planData.cases_remaining !== null && ` · ${planData.cases_remaining} remaining`}
            </p>
          </>
        ) : (
          <p className="text-slate-400 mt-3 text-sm">No subscription data found.</p>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <article
            key={plan.key}
            className={`glass-card p-4 ${plan.highlight ? 'border-cyan-300/45 shadow-[0_0_16px_rgba(0,212,255,.25)]' : ''}`}
          >
            <h3 className="employee-heading text-slate-100">{plan.name}</h3>
            <p className="text-2xl text-cyan-200 mt-2">
              {plan.price_inr === 0 ? 'Free' : `₹${plan.price_inr.toLocaleString('en-IN')}`}
            </p>
            <p className="text-sm text-slate-400 mt-2">
              Limit: {plan.cases_limit === -1 ? 'Unlimited' : plan.cases_limit} cases/month
            </p>
            <p className="text-xs text-slate-500 mt-1">{plan.description}</p>
            {planData && plan.key !== planData.plan && (
              <button className="mt-3 w-full h-9 rounded-full border border-cyan-400/30 text-cyan-200 text-sm hover:bg-cyan-500/10">
                Upgrade
              </button>
            )}
            {planData && plan.key === planData.plan && (
              <p className="mt-3 text-xs text-emerald-300">✓ Current Plan</p>
            )}
          </article>
        ))}
      </section>

      <section className="glass-card overflow-hidden">
        <div className="px-4 py-3 border-b border-cyan-400/10">
          <h3 className="employee-heading text-slate-100">Payment History</h3>
        </div>
        <div className="p-4 text-sm text-slate-400">
          Payment history will appear here after your first transaction.
        </div>
      </section>
    </div>
  );
};

export default EmployeeSubscription;
