import axios from "axios";
import { CenteringRecord } from "../types/CenteringRecord";
import { API_BASE } from "./config";


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

  const res = await axios.post(`${API_BASE}/compare`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.bounding_boxes;
}

export async function saveCenteringRecord(data: {
  image_index: number;
  image_file: File;
  outer_box: BoundingBox;
  inner_box: BoundingBox;
  horizontal_ratio: string;
  vertical_ratio: string;
}) {
  const formData = new FormData();

  const metadata = {
    image_index: data.image_index,
    outer_box: data.outer_box,
    inner_box: data.inner_box,
    horizontal_ratio: data.horizontal_ratio,
    vertical_ratio: data.vertical_ratio,
  };

  formData.append("image", data.image_file);
  formData.append("metadata", JSON.stringify(metadata));

  return axios.post(`${API_BASE}/save_centering`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });
}

export async function fetchSavedCenterings(): Promise<CenteringRecord[]> {
  const res = await axios.get(`${API_BASE}/centerings`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });

  return res.data;
}

export async function getCenteringRecord(id: number): Promise<CenteringRecord> {
  const res = await axios.get(`${API_BASE}/centerings/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });
  return res.data;
}

export async function updateCenteringRecord(
  id: number,
  updates: {
    outer_box: BoundingBox;
    inner_box: BoundingBox;
    horizontal_ratio: string;
    vertical_ratio: string;
  }
) {
  return axios.put(`${API_BASE}/centerings/${id}`, updates, {
    headers: {
      "Content-Type": "application/json", // ← add this
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });
}

export async function deleteCenteringRecord(id: number): Promise<void> {
  await axios.delete(`${API_BASE}/centerings/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });
}
