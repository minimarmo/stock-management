import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spacer,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  type ForwardedRef,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineQrcode } from "react-icons/ai";
import { z } from "zod";
import {
  addProduct,
  getProductByBarCode,
  logActivity,
  updateProduct,
} from "../services/stockService";
import BarcodeScanner from "./BarcodeScanner";

const schema = z.object({
  code: z.string().min(1, "QR Code ห้ามว่าง"),
  name: z.string().min(1, "ชื่อสินค้าห้ามว่าง"),
  price: z.number().min(0.01, "ราคาต้องมากกว่า 0"),
  quantity: z.number().min(1, "จำนวนต้องมากกว่า 0"),
  created_date: z.date().optional(),
  updated_date: z.date().optional(),
  notes: z.string().optional(),
});

export type ProductFormData = z.infer<typeof schema>;

export interface ProductFormProps {
  initialValues?: Partial<ProductFormData>;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
  setToastInfo: (info: {
    open: boolean;
    message: string;
    type?: "success" | "error" | "info" | "warning";
  }) => void;
}

export type ProductFormRef = {
  setQR: (qr: string) => void;
};

const ProductForm = forwardRef(function ProductForm(
  { initialValues, setToastInfo, onSubmitSuccess, onCancel }: ProductFormProps,
  ref: ForwardedRef<ProductFormRef>
) {
  const isEditMode = !!initialValues?.code;
  const { control, handleSubmit, reset, setValue } = useForm<ProductFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
      name: "",
      price: 0,
      quantity: 1,
    },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  useImperativeHandle(ref, () => ({
    setQR: (qr: string) => setValue("code", qr),
  }));

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    console.log("data:", data);

    try {
      if (isEditMode) {
        console.log("Edit Mode");

        const original = initialValues!;
        const notes: string[] = [];

        if (data.name !== original.name) notes.push("name");
        if (data.price !== original.price) notes.push("price");
        if (data.quantity !== original.quantity) notes.push("quantity");

        const payload = {
          ...data,
          created_date: dayjs(data.created_date).format("YYYY-MM-DD HH:mm:ss"),
          updated_date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        };

        await updateProduct(data.code, payload);
        // 📝 Log UPDATE ทุกกรณี
        await logActivity("UPDATE", {
          product_code: data.code,
          product_name: data.name,
          price: data.price,
          units: data.quantity,
          notes: notes.join(", "),
        });

        // 🔼 ถ้า quantity เปลี่ยน → log IN หรือ OUT
        const originalQty = original.quantity ?? 0;
        const newQty = data.quantity;

        if (newQty !== originalQty) {
          const diff = Math.abs(newQty - originalQty);
          const qtyAction = newQty > originalQty ? "IN" : "OUT";

          await logActivity(qtyAction, {
            product_code: data.code,
            product_name: data.name,
            price: data.price,
            units: diff,
            notes: "quantity",
          });
        }

        setToastInfo?.({
          open: true,
          message: "แก้ไขสินค้าสำเร็จ",
          type: "success",
        });
      } else {
        console.log("Create Mode");

        try {
          const existing = await getProductByBarCode(data.code);
          // ถ้ามีสินค้า → อัปเดต
          const updatedProduct = {
            ...existing,
            quantity: existing.quantity + data.quantity,
            created_date: dayjs(existing.created_date).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            updated_date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          };

          await updateProduct(data.code, updatedProduct);
          await logActivity("IN", {
            product_code: data.code,
            product_name: data.name,
            price: data.price,
            units: data.quantity,
          });

          setToastInfo?.({
            open: true,
            message: "อัปเดตจำนวนสินค้าแล้ว",
            type: "info",
          });
        } catch (err: any) {
          // ถ้าไม่พบสินค้าในระบบ (เช่น single() หาไม่เจอ)
          const isNotFound =
            err?.response?.status === 404 ||
            err?.message?.toLowerCase().includes("ไม่พบ");

          if (isNotFound) {
            await addProduct({
              ...data,
              created_date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
              updated_date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            });

            await logActivity("IN", {
              product_code: data.code,
              product_name: data.name,
              price: data.price,
              units: data.quantity,
            });

            setToastInfo?.({
              open: true,
              message: "เพิ่มสินค้าสำเร็จ",
              type: "success",
            });
          } else {
            // error อื่น ๆ
            setToastInfo?.({
              open: true,
              message: `เกิดข้อผิดพลาด ${String(err)}`,
              type: "error",
            });
            console.error("getProductByBarCode error:", err);
          }
        }
      }

      onSubmitSuccess?.();
      reset({
        code: "",
        name: "",
        price: 0,
        quantity: 1,
      });
    } catch (err) {
      setToastInfo?.({
        open: true,
        message: `เกิดข้อผิดพลาด ${String(err)}`,
        type: "error",
      });
      console.error("error:", err);
    } finally {
      setLoading(false);
    }
  };

  let buttonSaveLabel = "";

  if (loading) {
    buttonSaveLabel = "Saving...";
  } else if (isEditMode) {
    buttonSaveLabel = "บันทึกการเปลี่ยนแปลง";
  } else {
    buttonSaveLabel = "เพิ่มสินค้า";
  }

  return (
    <Box minH="500px" w="calc(100vw - 32px)">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <FormControl isRequired>
                <FormLabel>QR / Barcode</FormLabel>
                <Input
                  {...field}
                  isDisabled={isEditMode}
                  pr="4.5rem"
                  h="48px"
                />
                {!isEditMode && (
                  <IconButton
                    aria-label="scan"
                    icon={<AiOutlineQrcode />}
                    onClick={onOpen}
                    position="absolute"
                    right="10px"
                    top="35px"
                    backgroundColor="transparent"
                    fontSize="20px"
                  />
                )}
              </FormControl>
            )}
          />

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <FormControl isRequired>
                <FormLabel>ชื่อสินค้า</FormLabel>
                <Input {...field} h="48px" />
              </FormControl>
            )}
          />

          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <FormControl isRequired>
                <FormLabel>ราคาต่อหน่วย (บาท)</FormLabel>
                <NumberInput
                  step={1}
                  min={1}
                  precision={2}
                  value={field.value}
                  onChange={(_, valueAsNumber) => field.onChange(valueAsNumber)}
                >
                  <NumberInputField h="48px" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            )}
          />

          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <FormControl isRequired>
                <FormLabel>จำนวน</FormLabel>
                <NumberInput
                  step={1}
                  min={1}
                  value={field.value}
                  onChange={(_, valueAsNumber) => field.onChange(valueAsNumber)}
                >
                  <NumberInputField h="48px" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            )}
          />

          <Flex gap={2} mt="24px">
            <Button
              variant="outline"
              colorScheme="red"
              h="48px"
              w="full"
              onClick={() => {
                reset();
                onCancel?.();
              }}
            >
              ยกเลิก
            </Button>
            <Spacer />
            <Button
              type="submit"
              colorScheme="blue"
              h="48px"
              w="full"
              isLoading={loading}
              bg="#000000"
            >
              {buttonSaveLabel}
            </Button>
          </Flex>
        </Stack>
      </form>

      {/* Scanner Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>สแกน QR / Barcode</ModalHeader>
          <ModalBody>
            <BarcodeScanner
              onResult={(text) => {
                setValue("code", text);
                onClose();
              }}
              onError={(err) => console.warn("Scan error:", err)}
              onClose={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
});

export default ProductForm;
