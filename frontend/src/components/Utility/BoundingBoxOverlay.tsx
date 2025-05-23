import React from 'react';
import { Rnd } from 'react-rnd';

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Props {
  imageUrl: string;
  boxes: BoundingBox[];
  imageIndex: number;
  onBoxUpdate: (imageIdx: number, boxIdx: number, newBox: BoundingBox) => void;
}

const BoundingBoxOverlay: React.FC<Props> = ({ imageUrl, boxes, imageIndex, onBoxUpdate }) => {
  const colors = ['red', 'limegreen'];

  return (
    <div style={{ position: 'relative', width: '300px' }}>
      <img src={imageUrl} alt="Uploaded" style={{ width: '300px', display: 'block' }} />
      {boxes.map((box, i) => (
        <Rnd
          key={i}
          size={{ width: box.width, height: box.height }}
          position={{ x: box.x, y: box.y }}
          onDragStop={(_, data) => {
            const updatedBox = { ...box, x: data.x, y: data.y };
            onBoxUpdate(imageIndex, i, updatedBox);
          }}
          onResizeStop={(_, __, ref, delta, position) => {
            const updatedBox = {
              x: position.x,
              y: position.y,
              width: parseFloat(ref.style.width),
              height: parseFloat(ref.style.height),
            };
            onBoxUpdate(imageIndex, i, updatedBox);
          }}
          bounds="parent"
          style={{
            border: `2px solid ${colors[i % colors.length]}`,
            position: 'absolute',
            boxSizing: 'border-box',
            cursor: 'move',
          }}
        />
      ))}
    </div>
  );
};

export default BoundingBoxOverlay;
