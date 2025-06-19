import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Spacer,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Notification from "../components/Notification";
import ProductForm from "../components/ProductForm";
import { getAllProducts } from "../services/stockService";
import type { Product } from "../types/product";

export default function StockList() {
  const [rows, setRows] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [toastInfo, setToastInfo] = useState<{
    open: boolean;
    message: string;
    type?: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", type: "info" });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchStock = async () => {
    try {
      const all = await getAllProducts();
      setRows(all);
    } catch (err) {
      console.error("โหลด stock ล้มเหลว", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    onOpen();
  };

  const handleEditSuccess = () => {
    setEditingProduct(null);
    onClose();
    fetchStock();
  };

  let content: React.ReactNode;

  if (loading) {
    content = (
      <Stack spacing={4}>
        {[...Array(4)].map((_, i) => (
          <Box
            key={i}
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            boxShadow="md"
            bg="white"
          >
            <Skeleton height="16px" mb={2} />
            <Skeleton height="20px" mb={2} />
            <Skeleton height="16px" mb={1} width="60%" />
            <Skeleton height="16px" mb={1} width="40%" />
            <Skeleton height="14px" width="80%" />
          </Box>
        ))}
      </Stack>
    );
  } else if (rows.length === 0) {
    content = <Text color="gray.500">No Product in Stock</Text>;
  } else {
    content = (
      <Stack spacing={4}>
        {rows.map((product) => (
          <Flex
            key={product.code}
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            boxShadow="md"
            bg="white"
          >
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
                อัปเดตเมื่อ:
                {dayjs(product.updated_date).format("D MMM YYYY HH:mm:ss")}
              </Text>
            </Box>
            <Spacer />
            <Flex mt={2}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(product)}
              >
                แก้ไข
              </Button>
            </Flex>
          </Flex>
        ))}
      </Stack>
    );
  }

  return (
    <Box minH="90vh" w="calc(100vw - 32px)">
      {content}

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>แก้ไขสินค้า</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editingProduct && (
              <ProductForm
                initialValues={{
                  ...editingProduct,
                  created_date: editingProduct?.created_date
                    ? dayjs(editingProduct.created_date).toDate()
                    : undefined,
                  updated_date: editingProduct?.updated_date
                    ? dayjs(editingProduct.updated_date).toDate()
                    : undefined,
                }}
                setToastInfo={setToastInfo}
                onSubmitSuccess={handleEditSuccess}
                onCancel={onClose}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Notification
        open={toastInfo.open}
        message={toastInfo.message}
        type={toastInfo.type}
        onClose={() => setToastInfo({ ...toastInfo, open: false })}
      />
    </Box>
  );
}
