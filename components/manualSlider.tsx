"use client";

import React, { useEffect, useRef, useState } from "react";

interface SliderItem {
  id: number;
  content: React.ReactNode;
  author: React.ReactNode;
  authorName: React.ReactNode;
}

interface ManualSliderProps {
  items: SliderItem[];
  containerClass?: string;
  itemClass?: string;
}

const ManualSlider: React.FC<ManualSliderProps> = ({
  items,
  containerClass = "",
  itemClass = "",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // 👇 Har instance ke liye random interval 2000–5000ms
    const randomDelay = Math.floor(Math.random() * 3000) + 2000;

    const interval = setInterval(() => {
      if (!containerRef.current) return;

      const nextIndex = (currentIndex + 1) % items.length;
      setCurrentIndex(nextIndex);

      const container = containerRef.current;
      const card = container.querySelector("div");
      if (card) {
        const cardWidth =
          (card as HTMLElement).offsetWidth +
          parseInt(getComputedStyle(container).gap || "0");

        container.scrollTo({
          left: nextIndex * cardWidth,
          behavior: "smooth",
        });
      }
    }, randomDelay);

    return () => clearInterval(interval);
  }, [currentIndex, items.length]);

  return (
    <div
      ref={containerRef}
      className={`flex items-start justify-start gap-8 overflow-x-auto scroll-smooth no-scrollbar ${containerClass}`}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className={`flex-shrink-0 w-[300px] px-5 py-8 text-white bg-[#072b45] rounded-xl shadow-md ${itemClass}`}
        >
          <h1 className="text-lg font-medium">{item.content}</h1>
          <div className="mt-10">
            <h1 className="text-white text-lg font-bold">{item.author}</h1>
            <p className="text-white">{item.authorName}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManualSlider;
