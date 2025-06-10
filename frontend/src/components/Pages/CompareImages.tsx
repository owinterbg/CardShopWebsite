import React, { useState } from "react";
import {
  submitBoundingBoxRequest,
  BoundingBox,
  saveCenteringRecord,
} from "../../api/centering";
import CenteringEditor from "../Utility/CenteringEditor";

interface Centering {
  horizontal: string;
  vertical: string;
}

type DualBoundingBox = [BoundingBox, BoundingBox];

export default function CompareImages() {
  const [images, setImages] = useState<(string | null)[]>([null, null]);
  const [boxes, setBoxes] = useState<(DualBoundingBox | null)[]>([null, null]);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null]);
  const [centeringStats, setCenteringStats] = useState<(Centering | null)[]>([
    null,
    null,
  ]);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newImages = [...images];
    newImages[index] = URL.createObjectURL(file);
    setImages(newImages);

    const newFiles = [...imageFiles];
    newFiles[index] = file;
    setImageFiles(newFiles);

    if (newImages[0] && newImages[1] && newFiles[0] && newFiles[1]) {
      try {
        const newBoxes: [BoundingBox[], BoundingBox[]] =
          await submitBoundingBoxRequest(newFiles[0], newFiles[1]);

        const pairedBoxes: (DualBoundingBox | null)[] = [
          newBoxes[0] as DualBoundingBox,
          newBoxes[1] as DualBoundingBox,
        ];

        setBoxes(pairedBoxes);

        const stats: (Centering | null)[] = pairedBoxes.map((pair) => {
          if (!pair) return null;
          const [outer, inner] = pair;
          const left = inner.x - outer.x;
          const right = outer.x + outer.width - (inner.x + inner.width);
          const top = inner.y - outer.y;
          const bottom = outer.y + outer.height - (inner.y + inner.height);
          return {
            horizontal: calcRatio(left, right),
            vertical: calcRatio(top, bottom),
          };
        });

        setCenteringStats(stats);
      } catch (err) {
        console.error("Bounding box fetch error:", err);
      }
    }
  };

  const calcRatio = (val1: number, val2: number): string => {
    const total = val1 + val2;
    if (total === 0) return "0:0";
    const r1 = Math.round((val1 / total) * 100);
    const r2 = 100 - r1;
    return `${r1}:${r2}`;
  };

  const handleBoxUpdate = (
    imageIdx: number,
    boxIdx: number,
    newBox: BoundingBox
  ) => {
    setBoxes((prev) => {
      const newBoxes = [...prev];
      if (!newBoxes[imageIdx]) return prev;

      const updatedPair = [...newBoxes[imageIdx]!];
      updatedPair[boxIdx] = newBox;
      newBoxes[imageIdx] = updatedPair as DualBoundingBox;

      const [outer, inner] = updatedPair;
      const left = inner.x - outer.x;
      const right = outer.x + outer.width - (inner.x + inner.width);
      const top = inner.y - outer.y;
      const bottom = outer.y + outer.height - (inner.y + inner.height);

      const updatedStats = {
        horizontal: calcRatio(left, right),
        vertical: calcRatio(top, bottom),
      };

      setCenteringStats((prevStats) => {
        const newStats = [...prevStats];
        newStats[imageIdx] = updatedStats;
        return newStats;
      });

      return newBoxes;
    });
  };

  const handleSaveCentering = async (imageIdx: number) => {
    const pair = boxes[imageIdx];
    const stats = centeringStats[imageIdx];
    const file = imageFiles[imageIdx];
    if (!pair || !stats || !file) return;

    const [outer, inner] = pair;
    try {
      await saveCenteringRecord({
        image_index: imageIdx,
        image_file: file,
        outer_box: outer,
        inner_box: inner,
        horizontal_ratio: stats.horizontal,
        vertical_ratio: stats.vertical,
      });
      alert(`Centering for Image ${imageIdx + 1} saved successfully!`);
    } catch (error) {
      console.error("Error saving centering:", error);
      alert("Failed to save centering record.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "1rem",
      }}
    >
      <div style={{ display: "flex", gap: "40px" }}>
        {[0, 1].map((idx) => (
          <div key={idx}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e, idx)}
            />
            {images[idx] && boxes[idx] && centeringStats[idx] && (
              <CenteringEditor
                imageUrl={images[idx]!}
                boxes={boxes[idx]!}
                ratios={centeringStats[idx]!}
                onBoxUpdate={(boxIdx, newBox) =>
                  handleBoxUpdate(idx, boxIdx, newBox)
                }
                onSave={() => handleSaveCentering(idx)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
