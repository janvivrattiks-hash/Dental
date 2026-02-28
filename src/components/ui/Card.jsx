import { cn } from '../../utils/utils';

const Card = ({ children, className, title, subtitle, footer, ...props }) => {
    return (
        <div className={cn('card-premium transition-all duration-300', className)} {...props}>
            {(title || subtitle) && (
                <div className="px-6 py-4 border-b border-slate-50">
                    {title && <h3 className="text-lg font-bold text-slate-800">{title}</h3>}
                    {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
                </div>
            )}
            <div className="p-6">{children}</div>
            {footer && <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-50 rounded-b-xl">{footer}</div>}
        </div>
    );
};

export default Card;
