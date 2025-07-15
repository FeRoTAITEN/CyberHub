'use client';

import { useState } from 'react';
import { 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

export interface AlertProps {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  date: string;
  dismissible?: boolean;
  onDismiss?: (id: string) => void;
}

const Alert = ({ id, type, title, message, date, dismissible = true, onDismiss }: AlertProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const alertStyles = {
    critical: 'alert-critical',
    warning: 'alert-warning',
    info: 'alert-info',
    success: 'alert-success'
  };

  const icons = {
    critical: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
    success: CheckCircleIcon
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss(id);
    }
  };

  if (!isVisible) return null;

  const Icon = icons[type];

  return (
    <div className={`${alertStyles[type]} border rounded-lg p-4 mb-4 relative`}>
      <div className="flex items-start space-x-3 space-x-reverse">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">{title}</h4>
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-xs opacity-75">{date}</span>
              {dismissible && (
                <button
                  onClick={handleDismiss}
                  className="text-current hover:opacity-75 transition-opacity"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <p className="text-sm mt-1 opacity-90">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Alert; 