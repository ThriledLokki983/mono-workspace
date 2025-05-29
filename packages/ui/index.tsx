import type { ButtonProps } from '@mono/types/ui';

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = {
    padding:
      size === 'small'
        ? '6px 12px'
        : size === 'large'
          ? '12px 24px'
          : '10px 16px',
    background:
      variant === 'primary'
        ? '#333'
        : variant === 'secondary'
          ? '#666'
          : 'transparent',
    color: variant === 'outline' ? '#333' : '#fff',
    border: variant === 'outline' ? '1px solid #333' : 'none',
    borderRadius: '4px',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    fontSize: size === 'small' ? '12px' : size === 'large' ? '16px' : '14px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  };

  return (
    <button
      type={type}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      className={className}
      style={baseStyles}
      {...props}
    >
      {loading && <span>⏳</span>}
      {children}
    </button>
  );
};

// Export types for consumers
export type { ButtonProps, ButtonVariant, ButtonSize } from '@mono/types/ui';
