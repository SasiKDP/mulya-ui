import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const BDMDetailModal = ({ 
  open, 
  onClose, 
  children, 
  title 
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          {title}
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={onClose} 
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent dividers>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default BDMDetailModal;