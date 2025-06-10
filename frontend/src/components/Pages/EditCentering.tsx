import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BoundingBox } from "../../types/CenteringRecord";
import {
  getCenteringRecord,
  updateCenteringRecord,
} from "../../api/centering";
import { API_BASE } from "../../api/config";
import CenteringEditor from "../Utility/CenteringEditor";

interface Centering {
  horizontal: string;
  vertical: string;
}

export default function EditCentering() {
  const { id } = useParams<{ id: string }>();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<BoundingBox[] | null>(null);
  const [ratios, setRatios] = useState<Centering | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    getCenteringRecord(Number(id))
      .then((record) => {
        setBoxes([record.outer_box, record.inner_box]);
        setRatios({
          horizontal: record.horizontal_ratio,
          vertical: record.vertical_ratio,
        });
        setImageUrl(`${API_BASE}/uploads/${record.image_name}`);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load record.");
        setLoading(false);
      });
  }, [id]);

  const handleBoxUpdate = (boxIdx: number, newBox: BoundingBox) => {
    if (!boxes) return;

    const updatedBoxes = [...boxes];
    updatedBoxes[boxIdx] = newBox;
    setBoxes(updatedBoxes);

    const [outer, inner] = updatedBoxes;
    const left = inner.x - outer.x;
    const right = outer.x + outer.width - (inner.x + inner.width);
    const top = inner.y - outer.y;
    const bottom = outer.y + outer.height - (inner.y + inner.height);

    setRatios({
      horizontal: calcRatio(left, right),
      vertical: calcRatio(top, bottom),
    });
  };

  const handleSave = async () => {
    if (!boxes || !ratios || !id) return;
    const [outer, inner] = boxes;
    try {
      await updateCenteringRecord(Number(id), {
        outer_box: outer,
        inner_box: inner,
        horizontal_ratio: ratios.horizontal,
        vertical_ratio: ratios.vertical,
      });
      alert("Centering updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update centering.");
    }
  };

  const calcRatio = (val1: number, val2: number): string => {
    const total = val1 + val2;
    if (total === 0) return "0:0";
    const r1 = Math.round((val1 / total) * 100);
    const r2 = 100 - r1;
    return `${r1}:${r2}`;
  };

  if (loading) return <p style={{ padding: "1rem" }}>Loading...</p>;
  if (error) return <p style={{ padding: "1rem", color: "red" }}>{error}</p>;
  if (!imageUrl || !boxes || !ratios) return null;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Edit Centering</h2>
      <CenteringEditor
        imageUrl={imageUrl}
        boxes={boxes}
        ratios={ratios}
        onBoxUpdate={handleBoxUpdate}
        onSave={handleSave}
      />
    </div>
  );
}
