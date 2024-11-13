import { toast, ToastOptions, Slide, Id } from 'react-toastify';

import { AlertMsg, InfoMsg } from './toast-msg';
import { Icon } from '@/components/ui/icon';

export const defaultAlertsOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  transition: Slide,
  closeButton: false,
  containerId: 'alerts',
};

export const defaultInfoOptions: ToastOptions = {
  position: 'bottom-right',
  autoClose: 10000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  transition: Slide,
  closeButton: false,
  containerId: 'info',
};

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default';

interface INotify {
  type?: ToastType;
  title?: string;
  text?: string;
  toastOptions?: Partial<ToastOptions>;
}

interface IInform extends INotify {
  onAccept?: () => void;
  onDecline?: () => void;
}

export const notify = ({ type, title, text, toastOptions = {} }: INotify): Id => {
  const optionsToApply = { ...defaultAlertsOptions, ...toastOptions };

  const content = (
    <AlertMsg
      msgTitle={title}
      msgText={text}
    />
  );

  switch (type) {
    case 'success':
      return toast.success(content, {
        icon: (
          <Icon
            icon="pencil"
            size="sm"
            className="text-emerald-400"
          />
        ),
        ...optionsToApply,
      });
    case 'error':
      return toast.error(content, {
        icon: (
          <Icon
            icon="pencil"
            size="sm"
            className="text-red-500"
          />
        ),
        ...optionsToApply,
      });
    case 'info':
      return toast.info(content, {
        icon: (
          <Icon
            icon="pencil"
            size="sm"
            className="text-sky-500"
          />
        ),
        ...optionsToApply,
      });
    case 'warning':
      return toast.warn(content, {
        icon: (
          <Icon
            icon="pencil"
            size="sm"
            className="text-orange-400"
          />
        ),
        ...optionsToApply,
      });
    case 'default':
    default:
      return toast(content, optionsToApply);
  }
};

export const inform = ({ title, text, onAccept, onDecline, toastOptions = {} }: IInform): Id => {
  const optionsToApply = { ...defaultInfoOptions, ...toastOptions };

  return toast(
    <InfoMsg
      msgTitle={title}
      msgText={text}
      onAccept={onAccept}
      onDecline={onDecline}
    />,
    optionsToApply,
  );
};
