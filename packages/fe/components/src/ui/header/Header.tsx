import { forwardRef } from 'react';
import { Link } from '../link/Link';
import { Home, User } from 'lucide-react';
import type { HeaderProps } from '@mono/types/fe/ui';
import styles from './Header.module.scss';

export const Header = forwardRef<HTMLElement, HeaderProps>(
  (
    {
      logo,
      logoAlt = 'Logo',
      navItems = [
        {
          label: 'Home',
          href: '/',
          active: true,
          icon: Home,
          external: false,
          onClick: undefined,
        },
      ],
      showProfile = true,
      onProfileClick,
      onLogoClick,
      variant = 'default',
      fixed = false,
      className = '',
      children,
      'aria-label': ariaLabel = 'Main navigation',
      ...props
    },
    ref
  ) => {
    const headerClasses = [
      styles.header,
      styles[variant],
      fixed && styles.fixed,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const renderLogo = () => {
      const logoContent =
        typeof logo === 'string' ? (
          <img src={logo} alt={logoAlt} className={styles.logoImage} />
        ) : logo ? (
          logo
        ) : (
          <span className={styles.logoText}>Logo</span>
        );

      return (
        <div
          className={styles.logoSection}
          onClick={onLogoClick}
          onKeyDown={e => {
            if ((e.key === 'Enter' || e.key === ' ') && onLogoClick) {
              e.preventDefault();
              onLogoClick();
            }
          }}
          role={onLogoClick ? 'button' : undefined}
          tabIndex={onLogoClick ? 0 : undefined}
          aria-label='Go to homepage'
        >
          {logoContent}
        </div>
      );
    };

    const renderNavigation = () => (
      <nav
        className={styles.nav}
        role='navigation'
        aria-label='Main navigation'
      >
        <ul className={styles.navList}>
          {navItems.map((item, index) => {
            const IconComponent = item.icon;

            return (
              <li key={`${item.href}-${index}`} className={styles.navItem}>
                <Link
                  href={item.href}
                  external={item.external}
                  variant='muted'
                  size='medium'
                  className={`${styles.navLink} ${item.active ? styles.active : ''}`}
                  onClick={item.onClick}
                  aria-current={item.active ? 'page' : undefined}
                >
                  {IconComponent && typeof IconComponent === 'function' && (
                    <IconComponent className={styles.navIcon} />
                  )}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );

    const renderProfile = () => {
      if (!showProfile) return null;

      return (
        <div className={styles.profileSection}>
          <button
            className={styles.profileButton}
            onClick={onProfileClick}
            aria-label='User profile menu'
            type='button'
          >
            <User className={styles.profileIcon} />
          </button>
        </div>
      );
    };

    return (
      <header
        ref={ref}
        className={headerClasses}
        aria-label={ariaLabel}
        {...props}
      >
        {renderLogo()}
        {renderNavigation()}
        {renderProfile()}
        {children}
      </header>
    );
  }
);

Header.displayName = 'Header';
