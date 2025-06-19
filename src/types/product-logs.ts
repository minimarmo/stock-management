export type ProductLog = {
  id: number;
  action: "IN" | "OUT" | "UPDATE";
  product_code: string;
  product_name: string;
  price: number;
  units: number;
  created_at: string;
  notes?: string;
};
