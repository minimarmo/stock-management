import { useEffect } from "react";
import { registerSW } from "virtual:pwa-register";

export default function usePwaUpdatePrompt() {
  useEffect(() => {
    registerSW({
      onNeedRefresh() {
        const confirmed = window.confirm(
          "เวอร์ชันใหม่พร้อมแล้ว ต้องการโหลดเลยหรือไม่?"
        );
        if (confirmed) window.location.reload(); // โหลดใหม่เพื่อใช้เวอร์ชันล่าสุด
      },
      onOfflineReady() {
        console.log("พร้อมใช้งานแบบออฟไลน์");
      },
    });
  }, []);
}
