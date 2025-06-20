import { Box, Stack, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { FaCirclePlus } from "react-icons/fa6";
import type { ProductLog } from "../../types/product-logs";

interface Props {
  logs: ProductLog[];
}

export default function InReport({ logs }: Props) {
  return (
    <Stack spacing={2}>
      {logs.map((log, index) => (
        <Box key={index} p={2} borderWidth="1px" borderRadius="md">
          <Text display="flex" alignItems="center" gap={2}>
            <FaCirclePlus color="green" />
            นำเข้า: {log.product_name} +{log.units}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {dayjs(log.created_at).format("D MMM YYYY HH:mm")}
          </Text>
        </Box>
      ))}
    </Stack>
  );
}
