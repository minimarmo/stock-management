import { Alert, Snackbar } from "@mui/material";

export type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationProps {
  open: boolean;
  message: string;
  type?: NotificationType;
  duration?: number;
  onClose: () => void;
}

export default function Notification({
  open,
  message,
  type = "info",
  duration = 3000,
  onClose,
}: NotificationProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={type} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
