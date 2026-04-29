import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Toast = () => {
  const { toasts, removeToast } = useToast();

  const getTypeStyles = (type) => {
    const styles = {
      success: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        icon: CheckCircle,
        iconColor: 'text-green-500'
      },
      error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: AlertCircle,
        iconColor: 'text-red-500'
      },
      info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: Info,
        iconColor: 'text-blue-500'
      }
    };
    return styles[type] || styles.info;
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-md">
      {toasts.map(toast => {
        const styles = getTypeStyles(toast.type);
        const IconComponent = styles.icon;

        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 ${styles.bg} ${styles.border} border rounded-lg p-4 shadow-lg animate-in slide-in-from-right fade-in duration-300`}
          >
            <IconComponent className={`${styles.iconColor} flex-shrink-0`} size={20} />
            <p className={`${styles.text} flex-1 font-medium`}>{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className={`${styles.text} hover:opacity-70 transition-opacity flex-shrink-0`}
            >
              <X size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
