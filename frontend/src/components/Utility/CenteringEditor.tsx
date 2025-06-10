import React from "react";
import BoundingBoxOverlay from "./BoundingBoxOverlay";
import { BoundingBox } from "../../types/CenteringRecord";

interface Centering {
  horizontal: string;
  vertical: string;
}

interface Props {
  imageUrl: string;
  boxes: BoundingBox[];
  ratios: Centering;
  onBoxUpdate: (boxIdx: number, newBox: BoundingBox) => void;
  onSave: () => void;
}

export default function CenteringEditor({
  imageUrl,
  boxes,
  ratios,
  onBoxUpdate,
  onSave,
}: Props) {
  return (
    <div style={{ position: "relative", width: "300px", marginTop: "1rem" }}>
      <BoundingBoxOverlay
        imageUrl={imageUrl}
        boxes={boxes}
        imageIndex={0}
        onBoxUpdate={(_, boxIdx, newBox) => onBoxUpdate(boxIdx, newBox)}
      />
      <div style={{ marginTop: "10px", fontSize: "16px" }}>
        <p>
          <strong>Centering</strong>
        </p>
        <p>Left/Right: {ratios.horizontal}</p>
        <p>Top/Bottom: {ratios.vertical}</p>
      </div>
      <button
        onClick={onSave}
        style={{ marginTop: "12px", padding: "6px 12px", fontSize: "14px" }}
      >
        Save Changes
      </button>
    </div>
  );
}
