import React from 'react';
import {
    Plus,
    Check,
    X,
    Zap,
    Rocket,
    Building2,
    ChevronRight,
    ClipboardList,
    MoreHorizontal
} from 'lucide-react';
import { cn } from '../utils/utils';
import Button from '../components/ui/Button';

const SubscriptionPlans = () => {
    const plans = [
        {
            name: 'Basic',
            description: 'For small clinics',
            price: '49',
            credits: '500 Credits/mo',
            features: [
                { text: 'Electronic Health Records', included: true },
                { text: 'Basic Scheduling', included: true },
                { text: 'Patient Portals', included: true },
                { text: 'Telemedicine Module', included: false },
            ],
            icon: ClipboardList,
            isActive: false
        },
        {
            name: 'Pro',
            description: 'For growing practices',
            price: '99',
            credits: '2,000 Credits/mo',
            features: [
                { text: 'Everything in Basic', included: true },
                { text: 'Full Telemedicine Suite', included: true },
                { text: 'Advanced Analytics', included: true },
                { text: 'Priority 24/7 Support', included: true },
                { text: 'Pharmacy Integrations', included: true },
            ],
            icon: Rocket,
            isActive: true,
            tag: 'MOST POPULAR'
        },
        {
            name: 'Enterprise',
            description: 'For large hospital networks',
            price: 'Contact Us',
            credits: 'Unlimited Credits',
            features: [
                { text: 'Custom Integrations (API)', included: true },
                { text: 'Multi-clinic Management', included: true },
                { text: 'Dedicated Account Manager', included: true },
                { text: 'Custom SLAs & Compliance', included: true },
            ],
            icon: Building2,
            isActive: false
        }
    ];

    const performanceData = [
        { name: 'Basic', count: '421 Clinics', percentage: 45, color: 'bg-clinical-teal/40' },
        { name: 'Pro', count: '856 Clinics', percentage: 83, color: 'bg-[#0d9488]' },
        { name: 'Enterprise', count: '12 Groups', percentage: 15, color: 'bg-clinical-blue/30' },
    ];

    return (
        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#0d9488] rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                        <ClipboardList size={24} />
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Subscription Plans</h1>
                </div>

                <Button className="h-12 px-6 bg-[#0d9488] hover:bg-[#0c857a] text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-teal-500/20 active:scale-95 transition-all">
                    <Plus size={20} />
                    Create New Plan
                </Button>
            </div>

            {/* Manage Tiers Section */}
            <div className="mb-16">
                <div className="mb-10">
                    <h2 className="text-[32px] font-bold text-slate-900 tracking-tight mb-3">Manage Tiers</h2>
                    <p className="text-slate-500 font-medium text-lg max-w-3xl leading-relaxed">
                        Configure and monitor your service levels. Updates to plans will be reflected immediately for new subscribers. Existing users will maintain their current billing cycle.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={cn(
                                "relative bg-white rounded-[32px] p-8 lg:p-10 transition-all duration-500 h-fit",
                                plan.isActive
                                    ? "ring-2 ring-[#0d9488] shadow-[0_20px_50px_rgba(13,148,136,0.15)] scale-[1.02] z-10"
                                    : "border border-slate-100 shadow-xl shadow-slate-200/40 hover:translate-y-[-8px]"
                            )}
                        >
                            {plan.tag && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0d9488] text-white text-[11px] font-black tracking-[0.1em] px-5 py-2 rounded-full shadow-lg">
                                    {plan.tag}
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                                    <p className="text-slate-500 font-medium">{plan.description}</p>
                                </div>
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                                    plan.isActive ? "bg-[#eefcfb] text-[#0d9488]" : "bg-slate-50 text-slate-400"
                                )}>
                                    <plan.icon size={24} />
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl lg:text-5xl font-black text-slate-900">
                                        {plan.price === 'Contact Us' ? 'Contact' : `$${plan.price}`}
                                    </span>
                                    {plan.price !== 'Contact Us' && <span className="text-lg font-bold text-slate-400">/mo</span>}
                                    {plan.price === 'Contact Us' && <span className="text-xl font-bold text-slate-400 ml-1">Us</span>}
                                </div>
                                <div className="inline-block mt-4 bg-emerald-50 text-[#0d9488] text-[11px] font-bold px-3 py-1.5 rounded-lg tracking-wide">
                                    {plan.credits}
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                                            feature.included ? "bg-emerald-50 text-[#0d9488]" : "bg-slate-50 text-slate-300"
                                        )}>
                                            {feature.included ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                                        </div>
                                        <span className={cn(
                                            "text-sm font-bold",
                                            feature.included ? "text-slate-700" : "text-slate-300 line-through decoration-2"
                                        )}>
                                            {feature.text}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant={plan.isActive ? 'default' : 'outline'}
                                className={cn(
                                    "w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all text-sm lg:text-base",
                                    plan.isActive
                                        ? "bg-[#0d9488] hover:bg-[#0c857a] text-white shadow-lg shadow-teal-500/20"
                                        : "bg-slate-50 border-transparent text-slate-900 hover:bg-slate-100"
                                )}
                            >
                                <MoreHorizontal size={20} className="rotate-90 md:rotate-0" />
                                Edit Plan
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Plan Performance Section */}
            <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 p-8 lg:p-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                    <div>
                        <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2">Plan Performance</h3>
                        <p className="text-slate-500 font-medium">Distribution of active subscriptions across tiers.</p>
                    </div>
                    <button className="text-sm font-bold text-[#0d9488] hover:underline transition-all">
                        View Detailed Reports
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
                    {performanceData.map((item) => (
                        <div key={item.name} className="space-y-4 group">
                            <div className="flex items-center justify-between">
                                <span className="text-[15px] font-bold text-slate-900">{item.name}</span>
                                <span className="text-sm font-bold text-slate-400">{item.count}</span>
                            </div>
                            <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden p-[2px]">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-1000 ease-out shadow-sm",
                                        item.color
                                    )}
                                    style={{ width: `${item.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPlans;
