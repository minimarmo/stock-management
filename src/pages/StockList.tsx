import { Box, Card, CardContent, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getAllProducts } from "../services/stockService";
import type { Product } from "../types/product";

export default function StockList() {
  const [rows, setRows] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchStock();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <Typography>Loading...</Typography>;
    }

    if (rows.length === 0) {
      return (
        <Typography color="text.secondary">No Product in Stock</Typography>
      );
    }

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
        }}
      >
        {rows.map((product) => (
          <Box key={product.qr_code} sx={{ width: "100%" }}>
            <Card
              sx={{
                width: "100%",
                borderRadius: 2,
                boxShadow: 2,
                p: 1,
              }}
            >
              <CardContent sx={{ p: 1, width: "100%" }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 0.5, display: "block" }}
                >
                  QR: {product.qr_code}
                </Typography>

                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 0.5 }}
                >
                  {product.name}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, color: "primary.main" }}
                >
                  ฿{product.price.toFixed(2)}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  อัปเดตเมื่อ:{" "}
                  {dayjs(product.updated_date).format("D MMM YYYY HH:mm:ss")}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", minWidth: "100%", px: 4, py: 2 }}>
      {renderContent()}
    </Box>
  );
}
