import type { Alert } from '@/types';

export function useAlert(name: string) {
  const alert = reactive<Alert & { show: boolean }>({
    name,
    show: false,
    type: 'success',
    message: '',
  });

  function showAlert(message: string, type: Alert['type'] = 'success') {
    alert.show = true;
    alert.message = message;
    alert.type = type;
  }

  return { alert, showAlert };
}
