import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef } from "react";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: string) => void;
  active: boolean;
}

export default function QRScanner({
  onScanSuccess,
  onScanFailure,
  active,
}: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const cameraId = useRef<string | null>(null);
  const elementId = "qr-reader";

  useEffect(() => {
    if (!active) return;

    const initScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (!devices.length) throw new Error("ไม่พบกล้อง");

        cameraId.current = devices[0].id;

        scannerRef.current = new Html5Qrcode(elementId);

        await scannerRef.current.start(
          cameraId.current,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            onScanSuccess(decodedText);
            scannerRef.current?.stop(); // หยุดทันทีเมื่อสแกนสำเร็จ
          },
          (errorMessage) => {
            if (onScanFailure) onScanFailure(errorMessage);
          }
        );
      } catch (error) {
        console.error("QR Scanner error:", error);
        if (onScanFailure) onScanFailure((error as Error).message);
      }
    };

    initScanner();

    return () => {
      scannerRef.current?.stop().then(() => {
        scannerRef.current?.clear();
      });
    };
  }, [onScanSuccess, onScanFailure]);

  return <div id={elementId} style={{ width: "100%", margin: "0 auto" }} />;
}
