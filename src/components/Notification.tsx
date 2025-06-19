import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";

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
  const toast = useToast();

  useEffect(() => {
    if (open) {
      toast({
        title: message,
        status: type,
        duration,
        isClosable: true,
        position: "top",
        onCloseComplete: onClose,
      });
    }
  }, [open, message, type, duration, toast, onClose]);

  return null;
}
