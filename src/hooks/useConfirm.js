import React, { useState, useCallback } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button 
} from '@mui/material';

export const ConfirmProvider = ({ children }) => {
  const [dialogState, setDialogState] = useState({
    open: false,
    title: '',
    message: '',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    confirmButtonColor: 'primary',
    resolvePromise: null,
  });

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setDialogState({
        open: true,
        title: options.title || 'Confirm',
        message: options.message || 'Are you sure?',
        confirmButtonText: options.confirmButtonText || 'Confirm',
        cancelButtonText: options.cancelButtonText || 'Cancel',
        confirmButtonColor: options.confirmButtonColor || 'primary',
        resolvePromise: resolve,
      });
    });
  }, []);

  const handleClose = useCallback(() => {
    setDialogState((prevState) => ({
      ...prevState,
      open: false,
    }));
  }, []);

  const handleConfirm = useCallback(() => {
    dialogState.resolvePromise(true);
    handleClose();
  }, [dialogState.resolvePromise, handleClose]);

  const handleCancel = useCallback(() => {
    dialogState.resolvePromise(false);
    handleClose();
  }, [dialogState.resolvePromise, handleClose]);

  return (
    <>
      <ConfirmContext.Provider value={{ confirm }}>
        {children}
      </ConfirmContext.Provider>

      <Dialog
        open={dialogState.open}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialogState.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogState.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>{dialogState.cancelButtonText}</Button>
          <Button 
            onClick={handleConfirm} 
            color={dialogState.confirmButtonColor} 
            variant="contained" 
            autoFocus
          >
            {dialogState.confirmButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Create Context
export const ConfirmContext = React.createContext({
  confirm: () => Promise.resolve(false),
});

// Hook to use the confirm dialog
export const useConfirm = () => React.useContext(ConfirmContext);

// Usage:
// 1. Wrap your app with <ConfirmProvider>
// 2. Use the hook: const { confirm } = useConfirm();
// 3. Call confirm() with options and await the result