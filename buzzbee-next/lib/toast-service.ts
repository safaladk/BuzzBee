type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

type ToastListener = (toast: Toast) => void;

class ToastService {
  private listeners: ToastListener[] = [];

  subscribe(listener: ToastListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  show(message: string, type: ToastType = "info") {
    const toast: Toast = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      type,
    };
    this.listeners.forEach((listener) => listener(toast));
  }

  success(message: string) {
    this.show(message, "success");
  }

  error(message: string) {
    this.show(message, "error");
  }

  info(message: string) {
    this.show(message, "info");
  }

  warning(message: string) {
    this.show(message, "warning");
  }
}

export const toast = new ToastService();
export type { Toast, ToastType };
