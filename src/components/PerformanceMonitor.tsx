import { useEffect, useState } from 'react';

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<{
    loadTime: number;
    domContentLoaded: number;
    resourceCount: number;
  } | null>(null);

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return;

    const measurePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType('resource');
      
      setMetrics({
        loadTime: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
        domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
        resourceCount: resources.length,
      });
    };

    // Measure after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    return () => {
      window.removeEventListener('load', measurePerformance);
    };
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development' || !metrics) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-slate-800/90 border border-cyan-500/20 rounded-lg p-2 text-xs text-gray-300 z-50 backdrop-blur-sm">
      <div className="font-semibold text-cyan-400 mb-1 text-[10px]">Perf</div>
      <div className="text-[9px]">R: {metrics.resourceCount}</div>
      <div className="text-[9px]">D: {metrics.domContentLoaded}ms</div>
      <div className="text-[9px]">L: {metrics.loadTime}ms</div>
    </div>
  );
};
