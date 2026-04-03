import { cn } from '../../utils/utils';

const Button = ({ children, variant = 'primary', size = 'md', className, isLoading = false, disabled = false, ...props }) => {
    const variants = {
        primary: 'bg-clinical-blue text-white hover:bg-clinical-blue/90 shadow-sm',
        secondary: 'bg-clinical-teal text-white hover:bg-clinical-teal/90 shadow-sm',
        outline: 'border border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base font-semibold',
    };

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    <span>Loading...</span>
                </div>
            ) : children}
        </button>
    );
};

export default Button;
