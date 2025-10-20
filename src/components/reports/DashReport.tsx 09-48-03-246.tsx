import { Stack, Text } from "@chakra-ui/react";
import type { ProductLog } from "../../types/product-logs";

interface Props {
  logs: ProductLog[];
}

export default function DashReport({ logs }: Props) {
  const totalIn = logs
    .filter((log) => log.action === "IN")
    .reduce((sum, log) => sum + log.units, 0);
  const totalOut = logs
    .filter((log) => log.action === "OUT")
    .reduce((sum, log) => sum + log.units, 0);

  return (
    <Stack spacing={2}>
      <Text>📥 นำเข้า: {totalIn}</Text>
      <Text>📤 ขายออก: {totalOut}</Text>
    </Stack>
  );
}
