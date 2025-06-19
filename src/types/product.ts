export interface Product {
  id?: string;
  code: string;
  name: string;
  price: number;
  action?: "IN" | "OUT";
  quantity: number;
  created_date?: string;
  updated_date?: string;
}
