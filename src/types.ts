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

export type GroupedItem = InventoryItem & { quantity: number };
export type SortKey = 'quantity' | 'location' | 'dimensions' | 'origin' | 'packaging' | 'notes';
export type SortDirection = 'asc' | 'desc';