export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CenteringRecord {
  id: number;
  user_id: number;
  image_index: number;
  image_name?: string;
  outer_box: BoundingBox;
  inner_box: BoundingBox;
  horizontal_ratio: string;
  vertical_ratio: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}
