import { ReactNode } from "react";

// Base component props that all UI components might use
export interface BaseLinkProps {
  href: string;
  className?: string;
  children?: ReactNode;
}
