import { useEffect, useState } from 'react';

function getPageSize(width) {
  if (width >= 1536) return 5;
  if (width >= 1280) return 4;
  if (width >= 768) return 3;
  return 2;
}

function getGridClass(pageSize) {
  switch (pageSize) {
    case 5:
      return 'grid-cols-5';
    case 4:
      return 'grid-cols-4';
    case 3:
      return 'grid-cols-3';
    case 2:
      return 'grid-cols-2';
    default:
      return 'grid-cols-1';
  }
}

export function useHomeProductPageSize() {
  const [pageSize, setPageSize] = useState(() =>
    typeof window !== 'undefined' ? getPageSize(window.innerWidth) : 2
  );

  useEffect(() => {
    const update = () => setPageSize(getPageSize(window.innerWidth));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return { pageSize, gridClass: getGridClass(pageSize) };
}
