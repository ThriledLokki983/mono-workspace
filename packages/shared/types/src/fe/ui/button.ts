import { ReactNode } from "react";
import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import { BaseComponentProps } from "./base";

// Button-specific types
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps
  extends BaseComponentProps,
    Omit<AriaButtonProps, "className" | "style" | "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}
