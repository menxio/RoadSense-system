import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const ConfirmationDialog = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "primary",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "#f5f7fa",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
        <Button onClick={onCancel} variant="outlined" color="primary">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} variant="contained" color={confirmColor}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
