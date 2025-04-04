import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface VirtualImageGridProps {
  images: string[];
  breedName: string;
  onImageClick: (index: number) => void;
}

const ITEM_HEIGHT = 200; // 每個圖片項目的高度
const OVERSCAN = 3; // 上下額外渲染的項目數
const MOBILE_GAP = 8; // 手機版間距
const DESKTOP_GAP = 16; // 桌面版間距

export default function VirtualImageGrid({
  images,
  breedName,
  onImageClick,
}: VirtualImageGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
  const [columns, setColumns] = useState(3); // 預設3列
  const [gap, setGap] = useState(DESKTOP_GAP); // 預設間距

  // 計算列數和間距
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setColumns(3);
        setGap(MOBILE_GAP);
      } else if (width < 768) {
        setColumns(4);
        setGap(DESKTOP_GAP);
      } else {
        setColumns(5);
        setGap(DESKTOP_GAP);
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  // 計算可見範圍
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      // 計算可見的行數（考慮上下緩衝區）
      const visibleRows =
        Math.ceil(containerHeight / (ITEM_HEIGHT + gap)) + 2 * OVERSCAN;

      // 計算起始和結束的行索引
      const startRow = Math.max(
        0,
        Math.floor(scrollTop / (ITEM_HEIGHT + gap)) - OVERSCAN
      );
      const endRow = Math.min(
        Math.ceil(images.length / columns) - 1,
        startRow + visibleRows
      );

      // 轉換為實際的項目索引
      const startIndex = startRow * columns;
      const endIndex = Math.min(images.length - 1, (endRow + 1) * columns - 1);

      // 確保只渲染真正可見的項目
      const visibleStartIndex = Math.max(0, startIndex);
      const visibleEndIndex = Math.min(images.length - 1, endIndex);

      setVisibleRange({ start: visibleStartIndex, end: visibleEndIndex });
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll(); // 初始化

    return () => container.removeEventListener("scroll", handleScroll);
  }, [images.length, columns, gap]);

  // 計算總高度
  const totalRows = Math.ceil(images.length / columns);
  const totalHeight = totalRows * (ITEM_HEIGHT + gap) - gap; // 減去最後一行的間距

  // 計算項目的位置
  const getItemPosition = (index: number) => {
    const row = Math.floor(index / columns);
    const col = index % columns;
    const top = row * (ITEM_HEIGHT + gap);
    const itemWidth = 100 / columns;
    const left = col * itemWidth;
    return { top, left, width: itemWidth };
  };

  // 計算是否在視窗內
  const isInViewport = (index: number) => {
    const container = containerRef.current;
    if (!container) return false;

    const { top } = getItemPosition(index);
    const containerHeight = container.clientHeight;
    const scrollTop = container.scrollTop;

    return (
      top >= scrollTop - (ITEM_HEIGHT + gap) * OVERSCAN &&
      top <= scrollTop + containerHeight + (ITEM_HEIGHT + gap) * OVERSCAN
    );
  };

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-200px)] overflow-auto"
      style={{
        position: "relative",
        padding: `0 ${gap / 2}px`,
      }}
    >
      <div
        style={{
          height: totalHeight,
          position: "relative",
        }}
      >
        {images
          .slice(visibleRange.start, visibleRange.end + 1)
          .map((image, index) => {
            const actualIndex = visibleRange.start + index;
            // 只渲染在視窗內的項目
            if (!isInViewport(actualIndex)) return null;

            const { top, left, width } = getItemPosition(actualIndex);
            return (
              <div
                key={image}
                className="absolute cursor-pointer"
                onClick={() => onImageClick(actualIndex)}
                style={{
                  top: `${top}px`,
                  left: `${left}%`,
                  width: `calc(${width}% - ${gap}px)`,
                  height: ITEM_HEIGHT,
                  margin: `0 ${gap / 2}px`,
                }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={image}
                    alt={`${breedName} dog ${actualIndex + 1}`}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw"
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
