import { zodResolver } from "@hookform/resolvers/zod";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import {
  forwardRef,
  useImperativeHandle,
  useState,
  type ForwardedRef,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { addProduct } from "../services/stockService";
import BarcodeScanner from "./BarcodeScanner"; // 👉 ใช้ตัวนี้แทน QRScanner
import Notification, { type NotificationType } from "./Notification";

const schema = z.object({
  qr_code: z.string().min(1, "QR Code ห้ามว่าง"),
  name: z.string().min(1, "ชื่อสินค้าห้ามว่าง"),
  price: z.number().min(0.01, "ราคาต้องมากกว่า 0"),
  action: z.enum(["IN", "OUT"]).optional(),
  created_date: z.string().datetime().optional(),
  updated_date: z.string().datetime().optional(),
});

export type ProductFormData = z.infer<typeof schema>;

export interface ProductFormProps {
  initialValues?: Partial<ProductFormData>;
  onSubmitSuccess?: () => void;
}

export type ProductFormRef = {
  setQR: (qr: string) => void;
};

const ProductForm = forwardRef(function ProductForm(
  { initialValues, onSubmitSuccess }: ProductFormProps,
  ref: ForwardedRef<ProductFormRef>
) {
  const { control, handleSubmit, reset, setValue } = useForm<ProductFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      qr_code: "",
      name: "",
      price: 0,
      action: "IN",
      ...initialValues,
    },
  });

  const [scannerOpen, setScannerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState<{
    open: boolean;
    message: string;
    type: NotificationType;
  }>({
    open: false,
    message: "",
    type: "success",
  });

  useImperativeHandle(ref, () => ({
    setQR: (qr: string) => setValue("qr_code", qr),
  }));

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      await addProduct({
        ...data,
        action: "IN",
        created_date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        updated_date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      });
      setNotify({
        open: true,
        message: "เพิ่มสินค้าสำเร็จ",
        type: "success",
      });
      onSubmitSuccess?.();
      reset({ ...initialValues, qr_code: "" });
    } catch (err) {
      const e = err as Error;
      console.error(e);
      setNotify({
        open: true,
        message: "เกิดข้อผิดพลาด: " + e.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        maxWidth: "100%",
        p: 4,
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.error("❌ Validation errors:", errors);
        })}
      >
        <Controller
          name="qr_code"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="QR/Barcode"
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setScannerOpen(true)}>
                    <QrCodeScannerIcon />
                  </IconButton>
                ),
              }}
            />
          )}
        />

        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="ชื่อสินค้า"
              fullWidth
              margin="normal"
            />
          )}
        />

        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="ราคาต่อชิ้น"
              type="number"
              fullWidth
              margin="normal"
              onChange={(e) => field.onChange(+e.target.value)} // แปลงเป็น number
            />
          )}
        />

        <Button type="submit" fullWidth variant="contained" disabled={loading}>
          {loading ? "กำลังบันทึก..." : "บันทึกสินค้า"}
        </Button>
      </form>

      <Dialog open={scannerOpen} onClose={() => setScannerOpen(false)}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            สแกน QR / Barcode
          </Typography>
          {scannerOpen && (
            <BarcodeScanner
              onResult={(text) => {
                setValue("qr_code", text);
                setScannerOpen(false);
              }}
              onError={(err) => console.warn("Scan error:", err)}
              onClose={() => setScannerOpen(false)}
            />
          )}
        </Box>
      </Dialog>

      <Notification
        open={notify.open}
        message={notify.message}
        type={notify.type}
        onClose={() => setNotify({ ...notify, open: false })}
      />
    </Box>
  );
});

export default ProductForm;
