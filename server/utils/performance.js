export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    
    console.log(`${name} took ${end - start} milliseconds`);
    
    // Send to analytics service
    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: name,
        value: Math.round(end - start)
      });
    }
    
    return result;
  };
};

export const usePerformanceMonitor = () => {
  React.useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          console.log(`${entry.name}: ${entry.duration}ms`);
        }
      }
    });
    
    observer.observe({ entryTypes: ['measure'] });
    
    return () => observer.disconnect();
  }, []);
};