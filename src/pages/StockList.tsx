import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getAllProducts } from "../services/stockService";
import type { Product } from "../types/product";

export default function StockList() {
  const [rows, setRows] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStock = async () => {
    try {
      const all = await getAllProducts();
      const inStock = all.filter((p) => p.action === "IN");
      setRows(inStock);
    } catch (err) {
      console.error("โหลด stock ล้มเหลว", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  return (
    <Box sx={{ height: "100vh", maxWidth: "100%", p: 4 }}>
      {loading ? (
        <Typography>กำลังโหลด...</Typography>
      ) : rows.length === 0 ? (
        <Typography color="text.secondary">ไม่มีสินค้าคงเหลือ</Typography>
      ) : (
        <Grid container spacing={2}>
          {rows.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.qr_code}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    QR Code: {product.qr_code}
                  </Typography>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography color="text.primary">
                    ราคา: ฿{product.price.toFixed(2)}
                  </Typography>
                  <Typography color="text.secondary" fontSize={13}>
                    เพิ่มเมื่อ: {product.created_date}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
