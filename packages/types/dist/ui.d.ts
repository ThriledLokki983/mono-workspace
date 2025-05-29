import { ReactNode, CSSProperties } from "react";
export interface BaseComponentProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  testId?: string;
}
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";
export type ButtonSize = "small" | "medium" | "large";
export interface ButtonProps extends BaseComponentProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
}
export type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search";
export interface InputProps extends BaseComponentProps {
  type?: InputType;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  autoComplete?: string;
  autoFocus?: boolean;
}
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "small" | "medium" | "large" | "fullscreen";
  centered?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  footer?: ReactNode;
}
export interface CardProps extends BaseComponentProps {
  variant?: "elevated" | "outlined" | "filled";
  padding?: "none" | "small" | "medium" | "large";
  clickable?: boolean;
  onClick?: () => void;
  header?: ReactNode;
  footer?: ReactNode;
}
export interface ContainerProps extends BaseComponentProps {
  maxWidth?: "small" | "medium" | "large" | "xlarge" | "full";
  fluid?: boolean;
  centerContent?: boolean;
}
export interface GridProps extends BaseComponentProps {
  columns?: number | "auto-fit" | "auto-fill";
  gap?: "none" | "small" | "medium" | "large";
  alignItems?: "start" | "center" | "end" | "stretch";
  justifyContent?:
    | "start"
    | "center"
    | "end"
    | "space-between"
    | "space-around"
    | "space-evenly";
}
export interface FlexProps extends BaseComponentProps {
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  gap?: "none" | "small" | "medium" | "large";
  alignItems?: "start" | "center" | "end" | "stretch" | "baseline";
  justifyContent?:
    | "start"
    | "center"
    | "end"
    | "space-between"
    | "space-around"
    | "space-evenly";
}
export type IconSize = "small" | "medium" | "large" | "xlarge";
export interface IconProps extends BaseComponentProps {
  name: string;
  size?: IconSize;
  color?: string;
  onClick?: () => void;
}
export type ToastType = "success" | "error" | "warning" | "info";
export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
  onDismiss?: () => void;
}
export interface TableColumn<T = any> {
  key: keyof T;
  title: string;
  width?: string | number;
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => ReactNode;
  align?: "left" | "center" | "right";
}
export interface TableProps<T = any> extends BaseComponentProps {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  empty?: ReactNode;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  sorting?: {
    column: keyof T;
    direction: "asc" | "desc";
    onChange: (column: keyof T, direction: "asc" | "desc") => void;
  };
  selection?: {
    selectedRows: string[];
    onSelectionChange: (selectedRows: string[]) => void;
    getRowKey: (record: T) => string;
  };
}
export interface FormProps extends BaseComponentProps {
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  initialValues?: Record<string, any>;
  validationSchema?: any;
  loading?: boolean;
  disabled?: boolean;
}
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}
export interface SelectProps extends BaseComponentProps {
  options: SelectOption[];
  value?: string | number | (string | number)[];
  defaultValue?: string | number | (string | number)[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  onChange?: (value: string | number | (string | number)[]) => void;
  onSearch?: (query: string) => void;
  renderOption?: (option: SelectOption) => ReactNode;
  maxHeight?: number;
}
//# sourceMappingURL=ui.d.ts.map
