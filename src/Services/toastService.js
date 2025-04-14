import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Default configuration options
const defaultOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

/**
 * Toast Service - A reusable toast notification utility
 */
const ToastService = {
  /**
   * Success toast notification
   * @param {string} message - The message to display
   * @param {object} options - Override default toast options
   */
  success: (message, options = {}) => {
    toast.success(message, { ...defaultOptions, ...options });
  },

  /**
   * Error toast notification
   * @param {string} message - The message to display
   * @param {object} options - Override default toast options
   */
  error: (message, options = {}) => {
    toast.error(message, { 
      ...defaultOptions, 
      ...options,
      autoClose: options.autoClose || 5000 // Errors show longer by default
    });
  },

  /**
   * Info toast notification
   * @param {string} message - The message to display
   * @param {object} options - Override default toast options
   */
  info: (message, options = {}) => {
    toast.info(message, { ...defaultOptions, ...options });
  },

  /**
   * Warning toast notification
   * @param {string} message - The message to display
   * @param {object} options - Override default toast options
   */
  warning: (message, options = {}) => {
    toast.warning(message, { ...defaultOptions, ...options });
  },

  /**
   * Show a loading toast that can be updated later
   * @param {string} message - The loading message
   * @param {object} options - Override default toast options
   * @returns {string} The toast ID to use for updating
   */
  loading: (message = "Loading...", options = {}) => {
    return toast.loading(message, { 
      ...defaultOptions, 
      ...options,
      autoClose: false // Loading toasts don't auto-close
    });
  },

  /**
   * Update an existing toast (useful for loading -> success/error flows)
   * @param {string} toastId - The ID of the toast to update
   * @param {string} message - The new message
   * @param {string} type - The new toast type ('success', 'error', etc.)
   * @param {object} options - Override default toast options
   */
  update: (toastId, message, type = 'success', options = {}) => {
    toast.update(toastId, {
      render: message,
      type: type,
      isLoading: false,
      ...defaultOptions,
      ...options,
      autoClose: options.autoClose || 3000
    });
  },

  /**
   * Dismiss a specific toast
   * @param {string} toastId - The ID of the toast to dismiss
   */
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: () => {
    toast.dismiss();
  },

  /**
   * Show a toast with a custom component
   * @param {React.ReactNode} component - Custom React component to display
   * @param {object} options - Override default toast options
   */
  custom: (component, options = {}) => {
    toast(component, { ...defaultOptions, ...options });
  }
};

export default ToastService;