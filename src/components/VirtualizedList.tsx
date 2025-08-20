import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
  onScroll?: (scrollTop: number) => void;
  getItemKey?: (item: T, index: number) => string | number;
}

interface VirtualizedListState {
  scrollTop: number;
  isScrolling: boolean;
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = '',
  overscan = 5,
  onScroll,
  getItemKey
}: VirtualizedListProps<T>) {
  const [state, setState] = useState<VirtualizedListState>({
    scrollTop: 0,
    isScrolling: false
  });
  
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(state.scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );

    return {
      start: Math.max(0, startIndex - overscan),
      end: Math.min(items.length - 1, endIndex + overscan)
    };
  }, [state.scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // Get visible items
  const visibleItems = useMemo(() => {
    const result = [];
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      result.push({
        index: i,
        item: items[i],
        style: {
          position: 'absolute' as const,
          top: i * itemHeight,
          left: 0,
          right: 0,
          height: itemHeight
        }
      });
    }
    return result;
  }, [visibleRange, items, itemHeight]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    
    setState(prev => ({
      ...prev,
      scrollTop,
      isScrolling: true
    }));

    onScroll?.(scrollTop);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set isScrolling to false after scrolling stops
    scrollTimeoutRef.current = setTimeout(() => {
      setState(prev => ({
        ...prev,
        isScrolling: false
      }));
    }, 150);
  }, [onScroll]);

  // Scroll to specific item
  const scrollToItem = useCallback((index: number, align: 'start' | 'center' | 'end' = 'start') => {
    if (!scrollElementRef.current) return;

    let scrollTop = index * itemHeight;

    if (align === 'center') {
      scrollTop = scrollTop - containerHeight / 2 + itemHeight / 2;
    } else if (align === 'end') {
      scrollTop = scrollTop - containerHeight + itemHeight;
    }

    scrollTop = Math.max(0, Math.min(scrollTop, items.length * itemHeight - containerHeight));

    scrollElementRef.current.scrollTop = scrollTop;
  }, [itemHeight, containerHeight, items.length]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const totalHeight = items.length * itemHeight;

  return (
    <div
      ref={scrollElementRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, item, style }) => (
          <div
            key={getItemKey ? getItemKey(item, index) : index}
            style={style}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Hook for infinite scrolling
export const useInfiniteScroll = <T,>(
  initialItems: T[],
  loadMore: () => Promise<T[]>,
  hasMore: boolean = true,
  threshold: number = 0.8
) => {
  const [items, setItems] = useState<T[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [hasMoreItems, setHasMoreItems] = useState(hasMore);

  const handleScroll = useCallback(async (scrollTop: number) => {
    if (loading || !hasMoreItems) return;

    const scrollableHeight = items.length * 60; // Assuming 60px item height
    const containerHeight = 400; // Assuming 400px container height
    const scrollPercentage = (scrollTop + containerHeight) / scrollableHeight;

    if (scrollPercentage >= threshold) {
      setLoading(true);
      try {
        const newItems = await loadMore();
        if (newItems.length === 0) {
          setHasMoreItems(false);
        } else {
          setItems(prev => [...prev, ...newItems]);
        }
      } catch (error) {
        console.error('Failed to load more items:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [items.length, loading, hasMoreItems, threshold, loadMore]);

  return {
    items,
    loading,
    hasMoreItems,
    handleScroll,
    setItems
  };
};

// Memoized list item wrapper for better performance
export const MemoizedListItem = React.memo(
  ({ children }: { children: React.ReactNode }) => <>{children}</>,
  (prevProps, nextProps) => {
    // Custom comparison logic if needed
    return prevProps.children === nextProps.children;
  }
);

// Grid virtualization for 2D layouts
interface VirtualizedGridProps<T> {
  items: T[];
  itemWidth: number;
  itemHeight: number;
  containerWidth: number;
  containerHeight: number;
  gap?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  getItemKey?: (item: T, index: number) => string | number;
}

export function VirtualizedGrid<T>({
  items,
  itemWidth,
  itemHeight,
  containerWidth,
  containerHeight,
  gap = 0,
  renderItem,
  className = '',
  getItemKey
}: VirtualizedGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const columnsPerRow = Math.floor((containerWidth + gap) / (itemWidth + gap));
  const rowCount = Math.ceil(items.length / columnsPerRow);
  const rowHeight = itemHeight + gap;

  const visibleStartRow = Math.floor(scrollTop / rowHeight);
  const visibleEndRow = Math.min(
    visibleStartRow + Math.ceil(containerHeight / rowHeight) + 1,
    rowCount - 1
  );

  const visibleItems = useMemo(() => {
    const result = [];
    for (let row = visibleStartRow; row <= visibleEndRow; row++) {
      for (let col = 0; col < columnsPerRow; col++) {
        const index = row * columnsPerRow + col;
        if (index >= items.length) break;

        result.push({
          index,
          item: items[index],
          style: {
            position: 'absolute' as const,
            top: row * rowHeight,
            left: col * (itemWidth + gap),
            width: itemWidth,
            height: itemHeight
          }
        });
      }
    }
    return result;
  }, [visibleStartRow, visibleEndRow, columnsPerRow, items, itemWidth, itemHeight, rowHeight, gap]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const totalHeight = rowCount * rowHeight;

  return (
    <div
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, item, style }) => (
          <div
            key={getItemKey ? getItemKey(item, index) : index}
            style={style}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VirtualizedList;
