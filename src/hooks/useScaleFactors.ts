import { useState, useEffect, useCallback, type RefObject } from "react";

export interface ScaleFactors {
  scaleX: number;
  scaleY: number;
}

/**
 * Computes image scale factors based on a container element's size
 * relative to the original image dimensions (1200×820).
 * Uses a ResizeObserver to update on window/container resize.
 */
export function useScaleFactors(
  containerRef: RefObject<HTMLElement | null>,
  originalWidth: number,
  originalHeight: number
): ScaleFactors {
  const [scale, setScale] = useState<ScaleFactors>({ scaleX: 1, scaleY: 1 });

  const updateScale = useCallback(
    (width: number, height: number) => {
      setScale({
        scaleX: width / originalWidth,
        scaleY: height / originalHeight,
      });
    },
    [originalWidth, originalHeight]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        updateScale(width, height);
      }
    });

    observer.observe(el);

    // Initial measurement
    const rect = el.getBoundingClientRect();
    updateScale(rect.width, rect.height);

    return () => observer.disconnect();
  }, [containerRef, updateScale]);

  return scale;
}
