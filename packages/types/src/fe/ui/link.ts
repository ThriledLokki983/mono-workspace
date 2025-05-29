import { ReactNode } from "react";
import type { LinkProps as AriaLinkProps } from "react-aria-components";
import { BaseComponentProps } from "./base";

// Link-specific types
export type LinkVariant = "primary" | "secondary" | "muted" | "danger";
export type LinkSize = "small" | "medium" | "large";

export interface LinkProps
  extends BaseComponentProps,
    Omit<AriaLinkProps, "className" | "style" | "children"> {
  variant?: LinkVariant;
  size?: LinkSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  external?: boolean;
  underline?: boolean;
  noUnderline?: boolean;
}

// Legacy interface - keeping for backwards compatibility
export interface BaseLinkProps {
  href: string;
  className?: string;
  children?: ReactNode;
}
