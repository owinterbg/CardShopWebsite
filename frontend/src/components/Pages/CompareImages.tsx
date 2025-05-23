import React, { useState } from "react";
import BoundingBoxOverlay from "../Utility/BoundingBoxOverlay";
import { submitBoundingBoxRequest, BoundingBox } from "../../api/centering";

interface Centering {
  horizontal: string;
  vertical: string;
}

type DualBoundingBox = [BoundingBox, BoundingBox];

export default function CompareImages() {
  const [images, setImages] = useState<(string | null)[]>([null, null]);
  const [boxes, setBoxes] = useState<(DualBoundingBox | null)[]>([null, null]);
  const [centeringStats, setCenteringStats] = useState<(Centering | null)[]>([
    null,
    null,
  ]);

  const IMAGE_WIDTH = 300;
  const IMAGE_HEIGHT = 400;

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

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newImages = [...images];
    newImages[index] = URL.createObjectURL(file);
    setImages(newImages);

    if (newImages[0] && newImages[1]) {
      try {
        const image1 =
          index === 0
            ? file
            : (await fetch(images[0]!).then((res) =>
                res.blob()
              )) as unknown as File;

        const image2 =
          index === 1
            ? file
            : (await fetch(images[1]!).then((res) =>
                res.blob()
              )) as unknown as File;

        const newBoxes: [BoundingBox[], BoundingBox[]] =
          await submitBoundingBoxRequest(image1, image2);

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
          <div key={idx} style={{ position: "relative" }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e, idx)}
            />
            {images[idx] && boxes[idx] && (
              <>
                <BoundingBoxOverlay
                  imageUrl={images[idx]!}
                  boxes={boxes[idx]!}
                  imageIndex={idx}
                  onBoxUpdate={handleBoxUpdate}
                />
                {centeringStats[idx] && (
                  <div style={{ marginTop: "10px", fontSize: "16px" }}>
                    <p>
                      <strong>Image {idx + 1} Centering</strong>
                    </p>
                    <p>Left/Right: {centeringStats[idx]!.horizontal}</p>
                    <p>Top/Bottom: {centeringStats[idx]!.vertical}</p>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
