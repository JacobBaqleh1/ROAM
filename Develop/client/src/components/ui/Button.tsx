import React from 'react';

type Variant = 'primary' | 'danger' | 'ghost' | 'outline' | 'secondary';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-forest-500 hover:bg-forest-600 text-white shadow-sm',
  secondary: 'bg-sky-500 hover:bg-sky-600 text-white shadow-sm',
  danger:    'bg-red-600 hover:bg-red-700 text-white shadow-sm',
  ghost:     'bg-transparent hover:bg-forest-50 text-forest-600',
  outline:   'border border-forest-500 text-forest-600 hover:bg-forest-50 bg-transparent',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...rest}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-1',
        variantClasses[variant],
        sizeClasses[size],
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      {loading && (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
