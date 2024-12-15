export interface FirebaseUserData {
  accessToken: string;
  displayName: string | null;
  email: string | null;
  photoUrl: string | null;
  uid: string;
}

interface Privileges {
  read: boolean;
  write: boolean;
  delete: boolean;
}

interface DatabaseMetadata {
  databaseName: string;
  displayName: string;
  // typeOfItem: string;
  // description: string;
  // createdAt: number;
  // updatedAt: number;
}

export interface DatabaseUserData {
  databaseMetadata: DatabaseMetadata;
  privileges: Privileges;
  role: string;
}

interface UserInventoryData {
  databases: Record<string, DatabaseUserData>;
}

export interface UserDBData {
  uid: string;
  authorizations: Record<string, any>;
  displayName: string;
  email: string;
  photoURL: string;
}

export interface VisionaryUser {
  visionaryData: FirebaseUserData;
  inventoryData: UserInventoryData;
}

export interface InventoryItem {
  id?: number;
  location: string;
  origin: string;
  height: number;
  width: number;
  depth: number;
  packaging: string;
  notes: string | null;
  quantity?: number;
}

// export interface InventoryItem {
//   [prop: string]: string | number | null;
// }

export interface InventoryResponse {
  success: boolean;
  data: InventoryItem[];
}

export type GroupedItem = InventoryItem & { quantity: number };
export type SortKey = 'quantity' | 'location' | 'dimensions' | 'origin' | 'packaging' | 'notes';
export type SortDirection = 'asc' | 'desc';