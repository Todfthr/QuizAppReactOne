import * as React from 'react';
import { cn } from '../../lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<'div'> {
    hoverEffect?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, hoverEffect = false, ...props }, ref) => (
        <motion.div
            ref={ref}
            initial={hoverEffect ? { opacity: 0, y: 20 } : undefined}
            animate={hoverEffect ? { opacity: 1, y: 0 } : undefined}
            whileHover={hoverEffect ? { y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" } : undefined}
            transition={{ duration: 0.3 }}
            className={cn(
                'glass rounded-xl p-6 shadow-sm text-slate-900 dark:text-slate-100',
                className
            )}
            {...props}
        />
    )
);
Card.displayName = 'Card';

export { Card };
