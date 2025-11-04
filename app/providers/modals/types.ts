import type { ComponentType } from 'react';

export interface IModalItem {
  id?: string | number;
  component: ComponentType<any>;
  props?: any;
  close: () => void;
  onClosed?: Function;
  closeTimeoutMs?: number;
  closing?: boolean;
}

export interface IModalOptions<T> {
  id?: string | number;
  component: ComponentType<T>;
  props?: Partial<T>;
  onClosed?: Function;
  closeTimeoutMs?: number;
}

export interface IModalProps {
  close: () => any;
  closing?: boolean;
}
