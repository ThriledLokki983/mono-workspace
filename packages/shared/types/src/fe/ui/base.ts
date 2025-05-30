import { ReactNode, CSSProperties } from "react";

// Base component props that all UI components might use
export interface BaseComponentProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  testId?: string;
}
