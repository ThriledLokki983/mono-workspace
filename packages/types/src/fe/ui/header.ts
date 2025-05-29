import type { BaseComponentProps } from "./base";

/**
 * Navigation item configuration
 */
export interface NavItem {
  /** Navigation item label */
  label: string;
  /** Navigation item href */
  href: string;
  /** Is external link */
  external?: boolean;
  /** Is active/current page */
  active?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Icon to display (Lucide icon name or React component) */
  icon?: React.ComponentType | string;
}

/**
 * Header component variants
 */
export type HeaderVariant = "default" | "transparent" | "dark";

/**
 * Header component props extending React Aria component props
 */
export interface HeaderProps extends BaseComponentProps {
  /** Logo source (URL) or React component */
  logo?: string | React.ReactNode;
  /** Logo alt text (if logo is string) */
  logoAlt?: string;
  /** Navigation items */
  navItems?: NavItem[];
  /** Show profile icon */
  showProfile?: boolean;
  /** Profile click handler */
  onProfileClick?: () => void;
  /** Logo click handler */
  onLogoClick?: () => void;
  /** Header variant */
  variant?: HeaderVariant;
  /** Fixed position at top of page */
  fixed?: boolean;
  /** Additional aria-label for the header */
  "aria-label"?: string;
}
