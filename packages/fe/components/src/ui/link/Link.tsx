import { forwardRef } from 'react';
import { Link as AriaLink } from 'react-aria-components';
import type { LinkProps } from '@mono/types/fe/ui';
import styles from './Link.module.scss';

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'medium',
      leftIcon,
      rightIcon,
      external = false,
      underline = false,
      noUnderline = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const linkClasses = [
      styles.link,
      styles[variant],
      styles[size],
      external && styles.external,
      underline && styles.underline,
      noUnderline && styles.noUnderline,
      props.isDisabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <AriaLink
        ref={ref}
        className={linkClasses}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
        {children}
        {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
      </AriaLink>
    );
  }
);

Link.displayName = 'Link';

// Export types for consumers
export type { LinkProps, LinkVariant, LinkSize } from '@mono/types/fe/ui';
