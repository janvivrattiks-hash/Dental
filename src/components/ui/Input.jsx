import { cn } from '../../utils/utils';

const Input = ({ label, error, className, id, icon: Icon, ...props }) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label htmlFor={inputId} className="text-sm font-semibold text-slate-700 ml-0.5">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-clinical-blue transition-colors duration-200">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    id={inputId}
                    className={cn(
                        'w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm transition-all duration-300 outline-none placeholder:text-slate-400 focus:border-clinical-blue focus:ring-4 focus:ring-clinical-blue/10 active:bg-slate-50',
                        Icon && 'pl-10',
                        error && 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/10',
                        className
                    )}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-rose-600 ml-1 font-medium">{error}</p>}
        </div>
    );
};

export default Input;
