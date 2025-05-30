import { forwardRef } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import type { ButtonProps } from '@mono-workspace/shared-types/fe/ui';
import styles from './Button.module.scss';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'medium',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const buttonClasses = [
      styles.button,
      styles[variant],
      styles[size],
      loading && styles.loading,
      fullWidth && styles.fullWidth,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <AriaButton
        ref={ref}
        className={buttonClasses}
        isDisabled={props.isDisabled || loading}
        {...props}
      >
        {leftIcon && !loading && (
          <span className={styles.leftIcon}>{leftIcon}</span>
        )}
        {children}
        {rightIcon && !loading && (
          <span className={styles.rightIcon}>{rightIcon}</span>
        )}
      </AriaButton>
    );
  }
);

Button.displayName = 'Button';

// Export types for consumers
export type { ButtonProps, ButtonVariant, ButtonSize } from '@mono-workspace/shared-types/fe/ui';
