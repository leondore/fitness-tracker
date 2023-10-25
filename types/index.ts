export type ColorOpts =
  | 'primary'
  | 'red'
  | 'orange'
  | 'green'
  | 'sky'
  | 'indigo'
  | 'gray';

export type SizeOpts = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type IntentOpts = 'success' | 'error' | 'warning' | 'info';

export interface Alert {
  name: string;
  type?: IntentOpts;
  message: string;
  timeout?: number;
  closeable?: boolean;
}
