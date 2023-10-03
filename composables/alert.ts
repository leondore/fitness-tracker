import type { AlertProps } from '@/components/BaseAlert.vue';

interface AlertParams {
  message: string;
  type?: AlertProps['type'];
}

export function useAlert(name: string) {
  const alert = reactive<AlertProps & { show: boolean }>({
    name,
    show: false,
    type: 'success',
    message: '',
  });

  function showAlert(options: AlertParams) {
    alert.show = true;
    alert.message = options.message;
    alert.type = options.type;
  }

  return { alert, showAlert };
}
