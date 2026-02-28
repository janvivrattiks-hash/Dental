import Card from '../ui/Card';
import { cn } from '../../utils/utils';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => {
    const colorMap = {
        blue: 'bg-clinical-blue/10 text-clinical-blue',
        teal: 'bg-clinical-teal/10 text-clinical-teal',
        indigo: 'bg-indigo-100 text-indigo-600',
        amber: 'bg-amber-100 text-amber-600',
    };

    return (
        <Card className="hover:translate-y-[-4px] cursor-default">
            <div className="flex items-center justify-between mb-4">
                <div className={cn('p-3 rounded-xl transition-transform duration-300 group-hover:scale-110', colorMap[color])}>
                    {Icon && <Icon size={24} />}
                </div>
                {trend && (
                    <div className={cn(
                        'flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg',
                        trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
                    )}>
                        <span>{trend === 'up' ? '↑' : '↓'}</span>
                        <span>{trendValue}</span>
                    </div>
                )}
            </div>
            <div>
                <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase">{title}</p>
                <h2 className="text-3xl font-extrabold text-slate-800 mt-1">{value}</h2>
            </div>
        </Card>
    );
};

export default StatsCard;
