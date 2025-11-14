"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["Apple", "Banana", "Cherry", "Lemon"] as const;
type Fruit = typeof fruits[number];

function getRandomFruit(): Fruit {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>(Array.from({ length: 3 }, () => Array.from({ length: 3 }, getRandomFruit)));
  const [spinning, setSpinning] = useState(false);
  const [winMessage, setWinMessage] = useState<string | null>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWinMessage(null);
    const interval = setInterval(() => {
      setGrid((prev) => {
        const newGrid = prev.map((col, idx) => {
          const newCol = [...col];
          newCol.pop(); // remove bottom
          newCol.unshift(getRandomFruit()); // add new at top
          return newCol;
        });
        return newGrid;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
      checkWin();
    }, 2000);
  };

  const checkWin = () => {
    // Check rows
    for (let r = 0; r < 3; r++) {
      const row = [grid[0][r], grid[1][r], grid[2][r]];
      if (row.every((f) => f === row[0])) {
        setWinMessage(`You won with ${row[0]}!`);
        return;
      }
    }
    // Check columns
    for (let c = 0; c < 3; c++) {
      const col = [grid[c][0], grid[c][1], grid[c][2]];
      if (col.every((f) => f === col[0])) {
        setWinMessage(`You won with ${col[0]}!`);
        return;
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.map((col, colIdx) =>
          col.map((fruit, rowIdx) => (
            <div
              key={`${colIdx}-${rowIdx}`}
              className="flex h-16 w-16 items-center justify-center rounded-md border bg-white"
            >
              <span className="text-sm font-medium">{fruit}</span>
            </div>
          ))
        )}
      </div>
      <Button onClick={spin} disabled={spinning} variant="outline">
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {winMessage && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-lg font-semibold">{winMessage}</span>
          <Share text={`I just won ${winMessage.split(" ")[3]} on the Fruit Slot Machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
