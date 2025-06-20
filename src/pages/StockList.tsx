import {
  Box,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { AiOutlineFileSearch } from "react-icons/ai";
import CardView from "../components/ CardView";
import CardSkeleton from "../components/CardSkeleton";
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
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredRows = rows.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.code.toLowerCase().includes(query)
    );
  });

  let content: React.ReactNode;

  if (loading) {
    content = (
      <Stack spacing={4}>
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </Stack>
    );
  } else if (searchQuery && filteredRows.length === 0) {
    content = <Text color="gray.500">ไม่พบสินค้าที่ค้นหา</Text>;
  } else if (!searchQuery && rows.length === 0) {
    content = <Text color="gray.500">No Product in Stock</Text>;
  } else {
    content = (
      <Stack spacing={4}>
        {filteredRows.map((product) => (
          <CardView key={product.code} product={product} onEdit={handleEdit} />
        ))}
      </Stack>
    );
  }

  const totalItems = rows.reduce((sum, product) => sum + product.quantity, 0);

  return (
    <Box minH="90vh" w="calc(100vw - 32px)">
      <Flex align="center" justify="space-between" w="full" mb="12px">
        <Heading as="h3" size="lg">
          จำนวนสินค้าปัจจุบัน:
        </Heading>
        <Box
          as="h3"
          px="3"
          py="1"
          rounded="full"
          bg="green.100"
          fontWeight="bold"
        >
          {totalItems}
        </Box>
      </Flex>

      <InputGroup mb={4}>
        <InputLeftElement
          pointerEvents="none"
          display="flex"
          alignItems="center"
          height="100%"
        >
          <AiOutlineFileSearch size="20px" color="gray.400" />
        </InputLeftElement>
        <Input
          h="48px"
          placeholder="ค้นหาสินค้าด้วยชื่อหรือโค้ด..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>

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
