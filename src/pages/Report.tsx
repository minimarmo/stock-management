import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getAllProductLogs, getAllProducts } from "../services/stockService";
import type { Product } from "../types/product";
import type { ProductLog } from "../types/product-logs";

export default function Report() {
  const [stocks, setStocks] = useState<Product[]>([]);
  const [logs, setLogs] = useState<ProductLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const currentData = await getAllProducts();
        const logData = await getAllProductLogs();
        setStocks(currentData);
        setLogs(logData);
      } catch (err) {
        console.error("Error fetching logs", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const totalItems = stocks.reduce((sum, product) => sum + product.quantity, 0);
  const inData = logs
    .filter((log) => log.action === "IN")
    .reduce((sum, log) => sum + log.units, 0);
  const outData = logs
    .filter((log) => log.action === "OUT")
    .reduce((sum, log) => sum + log.units, 0);

  return (
    <Box p={4} minH="90vh" w="calc(100vw - 32px)">
      <Heading size="md" mb={4}>
        รายงานสต๊อกสินค้า
      </Heading>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <Stack spacing={2}>
          <Text>📦 จำนวนรายการทั้งหมด: {totalItems}</Text>
          <Text>📦 จำนวนรายการนำเข้า: {inData}</Text>
          <Text>📦 จำนวนยอดขาย: {outData}</Text>
        </Stack>
      )}
    </Box>
  );
}
