// Types for user Auth
export interface user {
  email: string;
  name: string;
  password?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password?: string;
}
export interface AuthState {
  user: user | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

//Types for drug Data
export interface Batch {
  batchNo: string;
  expiryDate: string;
  quantity: string;
}

export interface SingleDrugForm {
  ndc: string;
  brandName: string;
  genericName: string;
  manufacturer: string;
  dosageForm: string;
  strength: string;
  packageSize: string | number;
  uom: string;
  costPrice: string | number;
  sellingPrice: string | number;
  rxStatus: string;
  schedule: string;
  storage: string;
  minStockLevel: string | number;
  location: string;
  batches: Batch[];
}

export interface UploadStatus {
  type: "success" | "error" | "";
  message: string;
}

// Inventory interfaces
export interface Batch {
  id: number;
  drug_id: number;
  batch_no: string;
  expiry_date: string; // Dates are returned as strings in JSON
  quantity: string; // Depending on how the backend sends it, it could be a string or number
  cost_price: string | number;
  created_at: string;
  updated_at: string;
}

export interface Drug {
  id: number;
  ndc: string;
  brand_name: string | null;
  generic_name: string;
  manufacturer: string;
  dosage_form: string;
  strength: string;
  package_size: number;
  uom: string;
  selling_price: string | number;
  rx_status: "Rx" | "OTC"; // Using string literals for stricter typing
  schedule: string | null;
  storage: string | null;
  min_stock_level: number;
  location: string | null;
  created_at: string;
  updated_at: string;

  // Relations & Computed Fields from Controller
  batches?: Batch[];
  total_stock: number; // This comes from our withSum alias
}

// Optional: Define the API response structure
export interface InventoryResponse {
  success: boolean;
  data: Drug[];
}

//interface for order item
export interface OrderItem {
  id: number;
  drug_id: number;
  batch_id: number;
  quantity: number;
  batch_no: string | null;
  unit_price: string;
  subtotal: string;
  drug: Drug;
}

export interface Order {
  id: number;
  order_number: string;
  status: "pending" | "completed" | "cancelled";
  total_amount: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  patient_id: number;
  patient: Patient;
  items?: OrderItem[];
}

export interface CreateOrderPayload {
  items: Array<{
    drug_id: number;
    batch_no: number | string;
    quantity: number;
  }>;
  notes?: string;
}

//patient interface
export interface Patient {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  // ... other fields
}
