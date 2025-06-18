import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import BarcodeScanner from "../components/BarcodeScanner";
import {
  getProductByBarCode,
  markProductAsSold,
} from "../services/stockService";
import type { Product } from "../types/product";

export default function SellStock() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [scanned, setScanned] = useState<string[]>([]);
  const isProcessingRef = useRef(false);

  const handleScan = async (qrCode: string) => {
    if (isProcessingRef.current || scanned.includes(qrCode)) return;
    isProcessingRef.current = true;

    try {
      const product = await getProductByBarCode(qrCode);
      setProducts((prev) => [...prev, product]);
      setTotal((prev) => prev + product.price);
      setScanned((prev) => [...prev, qrCode]);
    } catch (err) {
      alert("❌ ไม่พบสินค้านี้ในสต๊อก");
      console.error(err);
    } finally {
      isProcessingRef.current = false;
    }
  };

  const confirmSale = async () => {
    try {
      for (const p of products) {
        await markProductAsSold(p.qr_code);
      }
      alert("✅ ขายสินค้าเรียบร้อยแล้ว");
      setProducts([]);
      setTotal(0);
      setScanned([]);
    } catch (err) {
      alert("❌ เกิดข้อผิดพลาดขณะอัปเดตสถานะสินค้า");
      console.error(err);
    }
  };

  const handleRemove = (index: number) => {
    const removed = products[index];
    setProducts((prev) => prev.filter((_, i) => i !== index));
    setTotal((prev) => prev - removed.price);
    setScanned((prev) => prev.filter((code) => code !== removed.qr_code));
  };

  return (
    <Box sx={{ height: "100vh", maxWidth: "100%", px: 2, pt: 1 }}>
      <Button
        sx={{ width: "100%" }}
        variant="contained"
        onClick={() => setScannerOpen(true)}
      >
        สแกนสินค้า
      </Button>

      <Dialog open={scannerOpen} onClose={() => setScannerOpen(false)}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">สแกน QR / Barcode</Typography>
          <BarcodeScanner
            onResult={(text) => {
              setScannerOpen(false);
              handleScan(text);
            }}
            onError={(err) => console.warn("Scan error:", err)}
            onClose={() => setScannerOpen(false)}
          />
        </Box>
      </Dialog>

      {products.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <List>
            {products.map((p, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleRemove(index)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={p.name}
                  secondary={`฿${p.price.toFixed(2)}`}
                />
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" sx={{ mt: 2 }}>
            รวมทั้งหมด: ฿{total.toFixed(2)}
          </Typography>

          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 2 }}
            onClick={confirmSale}
          >
            ยืนยันขายสินค้า
          </Button>
        </>
      )}
    </Box>
  );
}
