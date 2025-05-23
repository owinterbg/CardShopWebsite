import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function submitBoundingBoxRequest(
  image1: File,
  image2: File
): Promise<[BoundingBox[], BoundingBox[]]> {
  const formData = new FormData();
  formData.append("image1", image1);
  formData.append("image2", image2);

  const res = await axios.post(`${API_BASE}/api/compare`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return res.data.bounding_boxes;
}
