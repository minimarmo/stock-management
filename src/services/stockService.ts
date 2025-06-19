import dayjs from "dayjs";
import type { Product } from "../types/product";
import { supabase } from "./supabaseClient";

// Pull product list to show in report
export async function getAllProducts() {
  const { data, error } = await supabase.from("products").select("*");
  if (error) throw error;
  return data;
}

// Add new product
export async function addProduct(product: Product) {
  const { data, error } = await supabase.from("products").insert([product]);
  if (error) throw error;
  return data;
}

// Update product
export async function updateProduct(
  qr_code: string,
  updates: Partial<Product>
) {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("qr_code", qr_code);

  if (error) throw error;
  return data;
}

// Pull product detail by QR code
export async function getProductByBarCode(qrCode: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("qr_code", qrCode)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) throw new Error("ไม่พบสินค้าที่อยู่ในสต๊อก");
  return data;
}

export async function logActivity(
  action: string,
  qr_code: string,
  payload: unknown
) {
  const { error } = await supabase.from("logs").insert([
    {
      action,
      product_qr: qr_code,
      payload,
      created_at: new Date().toISOString(),
    },
  ]);
  if (error) console.warn("Log error", error);
}

// Update action and updated_date when selling
export async function setProductAsSold(qrCode: string, units: number) {
  const { data, error: fetchError } = await supabase
    .from("products")
    .select("quantity")
    .eq("qr_code", qrCode)
    .single();

  if (fetchError) throw fetchError;

  const currentQty = data?.quantity ?? 0;
  const newQty = currentQty - units;

  if (newQty < 0) {
    throw new Error("สินค้าในสต๊อกไม่พอขาย");
  }

  if (newQty === 0) {
    // ลบ record ถ้าเหลือ 0
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("qr_code", qrCode);
    if (deleteError) throw deleteError;
  } else {
    // อัปเดตจำนวนใหม่
    const { error: updateError } = await supabase
      .from("products")
      .update({
        quantity: newQty,
        updated_date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      })
      .eq("qr_code", qrCode);
    if (updateError) throw updateError;
  }
}
