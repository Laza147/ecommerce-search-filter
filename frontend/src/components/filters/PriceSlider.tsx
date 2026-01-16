import React, { useState } from 'react';
import type { PriceRange } from '../../types';

interface PriceSliderProps {
  min: number;
  max: number;
  value: PriceRange | null;
  onChange: (range: PriceRange | null) => void;
}

export const PriceSlider: React.FC<PriceSliderProps> = ({ min, max, value, onChange }) => {
  const [localMin, setLocalMin] = useState(value?.min ?? min);
  const [localMax, setLocalMax] = useState(value?.max ?? max);

  const clampValues = (nextMin: number, nextMax: number) => {
    const safeMin = Math.max(min, Math.min(nextMin, nextMax));
    const safeMax = Math.min(max, Math.max(nextMax, safeMin));
    setLocalMin(safeMin);
    setLocalMax(safeMax);
  };

  const apply = () => {
    if (localMin <= min && localMax >= max) {
      onChange(null);
    } else {
      onChange({ min: localMin, max: localMax });
    }
  };

  return (
    <div className="price-slider">
      <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem' }}>Price</div>
      <div className="price-slider-track">
        <input
          type="range"
          min={min}
          max={max}
          value={localMin}
          onChange={(e) => clampValues(Number(e.target.value), localMax)}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localMax}
          onChange={(e) => clampValues(localMin, Number(e.target.value))}
        />
      </div>
      <div className="price-slider-values">
        <span>
          ₹{localMin} - ₹{localMax}
        </span>
        <button onClick={apply}>Apply</button>
      </div>
    </div>
  );
};
