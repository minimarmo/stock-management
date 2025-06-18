import { useRef } from "react";
import ProductForm from "../components/ProductForm";

export default function AddStock() {
  const formRef = useRef<{
    setQR: (qr: string) => void;
  }>(null);

  return (
    <>
      <ProductForm
        ref={formRef}
        onSubmitSuccess={() => {
          console.log("สินค้าเพิ่มแล้ว");
        }}
      />
    </>
  );
}
