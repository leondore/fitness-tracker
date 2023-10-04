import type { AlertProps } from '@/components/BaseAlert.vue';

export function useAlert(name: string) {
  const alert = reactive<AlertProps & { show: boolean }>({
    name,
    show: false,
    type: 'success',
    message: '',
  });

  function showAlert(message: string, type: AlertProps['type'] = 'success') {
    alert.show = true;
    alert.message = message;
    alert.type = type;
  }

  return { alert, showAlert };
}
