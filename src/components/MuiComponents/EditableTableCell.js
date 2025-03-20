import React, { useState, useRef, useEffect } from 'react';
import { TableCell, TextField, Box, Button, Stack } from '@mui/material';

const EditableTableCell = ({ 
    value, 
    row, 
    column, 
    onSave, 
    disabled = false,
    searchQuery = '',
    highlightText 
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const inputRef = useRef(null);

    // Focus the input when entering edit mode
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleEditClick = () => {
        if (!disabled && column.editable !== false) {
            setIsEditing(true);
            setEditValue(value);
        }
    };

    const handleSave = () => {
        onSave(row.id, column.key, editValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const displayValue = typeof value === 'string' && value.length > 15
        ? `${value.slice(0, 15)}...`
        : value;

    // Determine if this field should be editable
    const editable = !disabled && column.editable !== false;

    return (
        <TableCell
            sx={{
                padding: 2,
                textAlign: 'left',
                cursor: editable ? 'pointer' : 'default',
                '&:hover': editable ? { backgroundColor: 'rgba(0, 121, 107, 0.08)' } : {},
                minWidth: column.width || 'auto',
                maxWidth: column.maxWidth || '200px',
                position: 'relative'
            }}
            onClick={editable && !isEditing ? handleEditClick : undefined}
        >
            {isEditing ? (
                <Box>
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        inputRef={inputRef}
                        autoFocus
                        InputProps={{
                            sx: { fontSize: '0.875rem' }
                        }}
                    />
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Button size="small" variant="contained" color="primary" onClick={handleSave}>
                            Save
                        </Button>
                        <Button size="small" variant="outlined" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            ) : (
                <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {highlightText ? highlightText(displayValue, searchQuery) : displayValue}
                </Box>
            )}
        </TableCell>
    );
};

export default EditableTableCell;