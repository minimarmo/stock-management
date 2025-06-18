import {
  BrowserMultiFormatReader,
  type IScannerControls,
} from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { useEffect, useRef } from "react";

interface Props {
  onResult: (text: string) => void;
  onError?: (err: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onResult, onError, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const hints = new Map<DecodeHintType, unknown>();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.QR_CODE,
      BarcodeFormat.EAN_13,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
    ]);

    const reader = new BrowserMultiFormatReader(hints);

    const startScanner = async () => {
      try {
        const controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current!,
          (result, error) => {
            if (result) {
              onResult(result.getText());
              controls.stop();
              clearTimeout(timeoutRef.current!);
              onClose(); // ✅ ปิด Dialog
            } else if (error && onError) {
              onError(error.message);
            }
          }
        );

        controlsRef.current = controls;

        // ✅ Timeout ปิดกล้อง + Dialog
        timeoutRef.current = setTimeout(() => {
          controls.stop();
          onError?.("หมดเวลา 20 วินาที");
          onClose(); // ✅ ปิด Dialog
        }, 20_000);
      } catch (err) {
        onError?.((err as Error).message);
        onClose(); // ✅ ถ้า error ก็ปิดเช่นกัน
      }
    };

    startScanner();

    return () => {
      controlsRef.current?.stop();
      clearTimeout(timeoutRef.current!);
    };
  }, [onResult, onError, onClose]);

  return (
    <video
      ref={videoRef}
      style={{
        width: "100%",
        maxWidth: "400px",
        borderRadius: "8px",
      }}
    />
  );
}
