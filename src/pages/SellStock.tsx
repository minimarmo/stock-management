import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  List,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { MdDelete, MdQrCodeScanner } from "react-icons/md";
import BarcodeScanner from "../components/BarcodeScanner";
import Notification from "../components/Notification";
import {
  getProductByBarCode,
  logActivity,
  setProductAsSold,
} from "../services/stockService";
import type { Product } from "../types/product";

type SellingProduct = Product & { units: number };

export default function SellStock() {
  const [products, setProducts] = useState<SellingProduct[]>([]);
  const [total, setTotal] = useState(0);
  const isProcessingRef = useRef(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [toastInfo, setToastInfo] = useState<{
    open: boolean;
    message: string;
    type?: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", type: "info" });

  const handleScan = async (qrCode: string) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    try {
      const existingIndex = products.findIndex((p) => p.code === qrCode);

      if (existingIndex !== -1) {
        // ถ้าสแกนซ้ำ → เพิ่ม units
        const updated = [...products];
        updated[existingIndex].units += 1;
        setProducts(updated);
        setTotal((prev) => prev + updated[existingIndex].price);
      } else {
        const product = await getProductByBarCode(qrCode);
        setProducts((prev) => [...prev, { ...product, units: 1 }]);
        setTotal((prev) => prev + product.price);
      }
    } catch (err) {
      setToastInfo({
        open: true,
        message: "ไม่พบสินค้านี้ในสต๊อก",
        type: "error",
      });
      console.error(err);
    } finally {
      isProcessingRef.current = false;
    }
  };

  const confirmSale = async () => {
    try {
      for (const p of products) {
        await setProductAsSold(p.code, p.units);
        await logActivity("OUT", {
          product_code: p.code,
          product_name: p.name,
          price: p.price,
          units: p.units,
        });
      }
      setToastInfo({
        open: true,
        message: "ขายสินค้าเรียบร้อยแล้ว",
        type: "success",
      });
      setProducts([]);
      setTotal(0);
    } catch (err) {
      setToastInfo({
        open: true,
        message: "เกิดข้อผิดพลาดขณะอัปเดตสถานะสินค้า",
        type: "error",
      });
      console.error(err);
    }
  };

  const handleRemove = (index: number) => {
    const removed = products[index];
    setProducts((prev) => prev.filter((_, i) => i !== index));
    setTotal((prev) => prev - removed.price * removed.units);
  };

  return (
    <Box minH="500px" w="calc(100vw - 32px)">
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>สแกน QR / Barcode</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <BarcodeScanner
              onResult={(text) => {
                onClose();
                handleScan(text);
              }}
              onError={(err) => console.warn("Scan error:", err)}
              onClose={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {products.length > 0 && (
        <>
          <Heading as="h4" size="md">
            รายการสินค้า
          </Heading>
          <Divider my={4} />

          <List spacing={3}>
            {products.map((p, index) => (
              <Flex key={index} justify="space-between" align="center">
                <Box>
                  <Text fontWeight="medium">{p.name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    ฿{p.price.toFixed(2)} × {p.units} ชิ้น
                  </Text>
                </Box>
                <Flex align="center" gap={2}>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (p.units > 1) {
                        const updated = [...products];
                        updated[index].units -= 1;
                        setProducts(updated);
                        setTotal((prev) => prev - p.price);
                      }
                    }}
                  >
                    −
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => {
                      const updated = [...products];
                      updated[index].units += 1;
                      setProducts(updated);
                      setTotal((prev) => prev + p.price);
                    }}
                  >
                    +
                  </Button>

                  <IconButton
                    aria-label="ลบ"
                    icon={<MdDelete />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleRemove(index)}
                  />
                </Flex>
              </Flex>
            ))}
          </List>

          <Heading size="md" mt={12}>
            รวมทั้งหมด: ฿{total.toFixed(2)}
          </Heading>

          <Button
            colorScheme="green"
            w="full"
            h="48px"
            mt={6}
            onClick={confirmSale}
          >
            ยืนยันขายสินค้า
          </Button>
        </>
      )}

      <Notification
        open={toastInfo.open}
        message={toastInfo.message}
        type={toastInfo.type}
        onClose={() => setToastInfo({ ...toastInfo, open: false })}
      />

      <IconButton
        aria-label="สแกนบาร์โค้ด"
        icon={<MdQrCodeScanner />}
        colorScheme="blue"
        isRound
        size="lg"
        onClick={onOpen}
        position="fixed"
        bottom="100px"
        right="24px"
        zIndex={1000}
        boxShadow="lg"
        bg="#000"
      />
    </Box>
  );
}
