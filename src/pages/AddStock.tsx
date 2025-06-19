import { Box } from "@chakra-ui/react";
import { useRef, useState } from "react";
import Notification from "../components/Notification";
import ProductForm from "../components/ProductForm";

export default function AddStock() {
  const formRef = useRef<{
    setQR: (qr: string) => void;
  }>(null);
  const [toastInfo, setToastInfo] = useState<{
    open: boolean;
    message: string;
    type?: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", type: "info" });

  return (
    <Box>
      <ProductForm
        ref={formRef}
        setToastInfo={setToastInfo}
        onSubmitSuccess={() => {
          console.log("สินค้าเพิ่มแล้ว");
        }}
      />
      <Notification
        open={toastInfo.open}
        message={toastInfo.message}
        type={toastInfo.type}
        onClose={() => setToastInfo({ ...toastInfo, open: false })}
      />
    </Box>
  );
}
