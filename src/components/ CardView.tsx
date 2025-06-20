import { Box, Button, Flex, Spacer, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import type { Product } from "../types/product";

interface CardViewProps {
  product: Product;
  onEdit: (product: Product) => void;
}

export default function CardView({ product, onEdit }: CardViewProps) {
  return (
    <Flex borderWidth="1px" borderRadius="lg" p={4} boxShadow="md" bg="white">
      <Box>
        <Text fontSize="sm" color="gray.500">
          Code: {product.code}
        </Text>
        <Text fontWeight="bold" fontSize="lg">
          {product.name}
        </Text>
        <Text color="blue.600" fontWeight="semibold">
          ฿{product.price.toFixed(2)}
        </Text>
        <Text>จำนวน {product.quantity}</Text>
        <Text fontSize="xs" color="gray.500">
          อัปเดตเมื่อ:{" "}
          {dayjs(product.updated_date).format("D MMM YYYY HH:mm:ss")}
        </Text>
      </Box>
      <Spacer />
      <Flex mt={2}>
        <Button size="sm" variant="outline" onClick={() => onEdit(product)}>
          แก้ไข
        </Button>
      </Flex>
    </Flex>
  );
}
