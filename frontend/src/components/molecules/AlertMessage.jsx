import { Alert, Collapse } from "@mui/material";

const AlertMessage = ({ open, message, severity, onClose }) => {
  return (
    <Collapse in={open}>
      <Alert severity={severity} onClose={onClose} sx={{ mb: 2 }}>
        {message}
      </Alert>
    </Collapse>
  );
};

export default AlertMessage;
