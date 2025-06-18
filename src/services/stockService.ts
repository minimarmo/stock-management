import dayjs from "dayjs";
import type { Product } from "../types/product";
import { supabase } from "./supabaseClient";

// Add new product
export async function addProduct(product: Product) {
  const { data, error } = await supabase.from("products").insert([product]);
  if (error) throw error;
  return data;
}

// Pull product detail by QR code
export async function getProductByBarCode(qrCode: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("qr_code", qrCode)
    .eq("action", "IN")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) throw new Error("ไม่พบสินค้าที่อยู่ในสต๊อก");
  return data;
}

// Pull product list to show in report
export async function getAllProducts() {
  const { data, error } = await supabase.from("products").select("*");
  if (error) throw error;
  return data;
}

// Update action and updated_date when selling
export async function markProductAsSold(qrCode: string) {
  const { error } = await supabase
    .from("products")
    .update({
      action: "OUT",
      updated_date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    })
    .eq("qr_code", qrCode)
    .eq("action", "IN"); // ✅ ป้องกันซ้ำ
  if (error) throw error;
}
