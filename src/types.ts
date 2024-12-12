export interface InventoryItem {
  id: number;
  location: string;
  origin: string;
  height: number;
  width: number;
  depth: number;
  packaging: string;
  notes: string | null;
  quantity?: number;
}