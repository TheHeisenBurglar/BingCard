'use client';

import { useActionState, useEffect } from 'react';
import { useState } from 'react';
import { createBingoCard } from './actions';
import { useRouter } from 'next/navigation';

const perfectSquares = [9, 25, 49, 81];

export default function BingoCardPage() {
  const [state, formAction, pending] = useActionState(createBingoCard, undefined);
  const [gridSize, setGridSize] = useState(25);
  const [slotValues, setSlotValues] = useState<string[]>(Array(25).fill(''));
  
  const router = useRouter();
  useEffect(() => {
    if(state?.success) {
      router.push('/') //TODO: go to my-cards
    }
  })
  const handleGridSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseInt(e.target.value);
    const snapped = perfectSquares.reduce((prev, curr) =>
      Math.abs(curr - raw) < Math.abs(prev - raw) ? curr : prev
    );
    setGridSize(snapped);
    setSlotValues((prev) => {
      const newValues = [...prev];
      newValues.length = snapped;
      return newValues.fill('', prev.length);
    });
  };

  const handleSlotChange = (index: number, value: string) => {
    const updated = [...slotValues];
    updated[index] = value;
    setSlotValues(updated);
  };

    const renderGridPreview = () => {
        const dim = Math.sqrt(gridSize);
        const centerIndex = gridSize % 2 === 1 ? Math.floor(gridSize / 2) : -1; // Only works for odd-sized square grids

        return (
            <div
            className="grid gap-1 mt-2 m-auto"
            style={{ gridTemplateColumns: `repeat(${dim}, 1fr)`, maxWidth: '400px' }}
            >
            {Array.from({ length: gridSize }).map((_, i) => (
                <div
                key={i}
                className={`aspect-square border border-gray-400 ${i === centerIndex ? 'bg-secondary' : 'bg-white'}`}
                />
            ))}
            </div>
        );
    };


  const renderSlotInputs = () => {
  const centerIndex = gridSize % 2 === 1 ? Math.floor(gridSize / 2) : -1;

  return (
    <div className="grid gap-2 mt-2 max-h-64 overflow-y-auto border rounded p-2 bg-base-200">
      {slotValues.map((value, i) => (
        <div key={i}>
          <label className="text-sm">Slot {i + 1}</label>
          <input
            type="text"
            className={`input input-sm w-full ${i === centerIndex ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : ''}`}
            name={`slot-${i}`}
            value={i === centerIndex ? 'FREE SPOT' : value}
            disabled={i === centerIndex}
            onChange={(e) => handleSlotChange(i, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};


  return (
    <form action={formAction} className="p-4 border rounded-md space-y-4 max-w-xl mx-auto"
          onSubmit={(e) => {
            const form = e.currentTarget;
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = 'slotEntries';
            hiddenField.value = JSON.stringify(slotValues);
            form.appendChild(hiddenField);
          }}
    >
      <h1 className="text-xl font-bold">Create Bingo Card</h1>

      <div>
        <label>Name</label>
        <input name="name" className="input w-full" required />
      </div>

      <div className="flex gap-2">
        <label><input type="checkbox" name="public" /> Public</label>
        <label><input type="checkbox" name="friendsCanView" /> Friends Can View</label>
        <label><input type="checkbox" name="photoEnabled" /> Photo Enabled</label>
      </div>

      <div>
        <label htmlFor="gridsize">
          Grid Size: {Math.sqrt(gridSize)} x {Math.sqrt(gridSize)}
        </label>
        <input
          name="gridsize"
          type="range"
          min={9}
          max={81}
          step={1}
          value={gridSize}
          onChange={handleGridSizeChange}
          className="range w-full"
        />
        <input type="hidden" name="gridsize" value={gridSize} />
        {renderGridPreview()}
      </div>

      <div>
        <label className="block">Enter Slot Entries</label>
        {renderSlotInputs()}
      </div>

      <div>
        <label>Participants (comma separated)</label>
        <input name="participants" className="input w-full" placeholder="e.g. Alice,Bob,Charlie" />
      </div>

      {state?.message && <p className="text-red-500">{state.message}</p>}

      <button type="submit" disabled={pending} className="btn btn-primary">Create</button>
    </form>
  );
}
