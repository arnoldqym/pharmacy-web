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
