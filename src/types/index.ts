// ============================================================
// types/index.ts — shared TypeScript types for the entire app
// ============================================================

export type ProductCategory = 'mithila_painting' | 'knitting';
export type ProductType     = 'ready_to_ship'    | 'made_to_order';
export type PaymentStatus   = 'pending'  | 'captured' | 'failed';
export type ProductionStatus = 'received' | 'painting' | 'shipped' | 'delivered';

export interface Product {
  id:          string;
  title:       string;
  description: string;
  story:       string | null;
  price:       number;
  category:    ProductCategory;
  type:        ProductType;
  size:        string | null;
  images:      string[];
  is_featured: boolean;
  created_at:  string;
}

export interface Order {
  id:                   string;
  customer_name:        string;
  customer_email:       string;
  customer_phone:       string | null;
  shipping_address:     string;
  total_amount:         number;
  razorpay_order_id:    string | null;
  razorpay_payment_id:  string | null;
  payment_status:       PaymentStatus;
  production_status:    ProductionStatus;
  created_at:           string;
  order_items?:         OrderItem[];  // joined when needed
}

export interface OrderItem {
  id:                 number;
  order_id:           string;
  product_id:         string;
  quantity:           number;
  price_at_purchase:  number;
  product?:           Product;        // joined when needed
}

// Cart (client-side only — not persisted to DB)
export interface CartItem {
  product:  Product;
  quantity: number;
}

// Razorpay window global (for the checkout script)
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface RazorpayOptions {
  key:         string;
  amount:      number;
  currency:    string;
  name:        string;
  description: string;
  order_id:    string;
  handler:     (response: RazorpayResponse) => void;
  prefill:     { name: string; email: string; contact: string };
  theme:       { color: string };
}

export interface RazorpayResponse {
  razorpay_order_id:   string;
  razorpay_payment_id: string;
  razorpay_signature:  string;
}

export interface RazorpayInstance {
  open: () => void;
}
