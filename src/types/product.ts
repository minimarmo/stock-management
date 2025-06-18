export interface Product {
  id?: string;
  qr_code: string;
  name: string;
  price: number;
  action: "IN" | "OUT";
  created_date?: string;
  updated_date?: string;
}
