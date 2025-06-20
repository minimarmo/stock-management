import dayjs from "dayjs";
import type { Product } from "../types/product";
import { supabase } from "./supabaseClient";

// Pull product list
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
export async function updateProduct(code: string, updates: Partial<Product>) {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("code", code);

  if (error) throw error;
  return data;
}

// Pull product detail by QR code
export async function getProductByBarCode(code: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("code", code)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) throw new Error("ไม่พบสินค้าที่อยู่ในสต๊อก");
  return data;
}

// Update action and updated_date when selling
export async function setProductAsSold(code: string, units: number) {
  const { data, error: fetchError } = await supabase
    .from("products")
    .select("quantity")
    .eq("code", code)
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
      .eq("code", code);
    if (deleteError) throw deleteError;
  } else {
    // อัปเดตจำนวนใหม่
    const { error: updateError } = await supabase
      .from("products")
      .update({
        quantity: newQty,
        updated_date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      })
      .eq("code", code);
    if (updateError) throw updateError;
  }
}

/**
 * บันทึกกิจกรรมที่เกิดกับสินค้า
 * @param action เช่น 'IN' | 'OUT' | 'UPDATE'
 * @param product ข้อมูลสินค้า (ควรเป็น partial หรือระบุเฉพาะฟิลด์สำคัญ)
 */
export async function logActivity(
  action: string,
  product: {
    product_code: string;
    product_name: string;
    price: number;
    units: number;
    notes?: string;
  }
) {
  const { error } = await supabase.from("product_logs").insert([
    {
      action,
      product_code: product.product_code,
      product_name: product.product_name,
      price: product.price,
      units: product.units,
      total: product.price * product.units,
      created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      notes: product?.notes,
    },
  ]);

  if (error) {
    console.warn("Log activity failed:", error);
    throw error;
  }
}

// Pull product logs
export async function getAllProductLogs(month?: string) {
  const from = dayjs(month).startOf("month").format("YYYY-MM-DD");
  const to = dayjs(month).endOf("month").format("YYYY-MM-DD");

  const { data, error } = await supabase
    .from("product_logs")
    .select("*")
    .gte("created_at", from)
    .lte("created_at", to);

  if (error) throw error;
  return data;
}
