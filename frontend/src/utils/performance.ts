// Performance monitoring utilities for the chatbot

interface PerformanceMetrics {
  responseTime: number;
  timestamp: number;
  messageLength: number;
  isCached: boolean;
}

class ChatbotPerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 50; // Keep last 50 responses

  addMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric);
    
    // Keep only the last maxMetrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  getAverageResponseTime(): number {
    if (this.metrics.length === 0) return 0;
    
    const totalTime = this.metrics.reduce((sum, metric) => sum + metric.responseTime, 0);
    return Math.round(totalTime / this.metrics.length);
  }

  getCacheHitRate(): number {
    if (this.metrics.length === 0) return 0;
    
    const cacheHits = this.metrics.filter(metric => metric.isCached).length;
    return Math.round((cacheHits / this.metrics.length) * 100);
  }

  getPerformanceReport(): string {
    const avgResponseTime = this.getAverageResponseTime();
    const cacheHitRate = this.getCacheHitRate();
    const totalRequests = this.metrics.length;

    return `
📊 Performance Report:
• Average Response Time: ${avgResponseTime}ms
• Cache Hit Rate: ${cacheHitRate}%
• Total Requests: ${totalRequests}
• Fastest Response: ${Math.min(...this.metrics.map(m => m.responseTime))}ms
• Slowest Response: ${Math.max(...this.metrics.map(m => m.responseTime))}ms
    `.trim();
  }

  clearMetrics() {
    this.metrics = [];
  }
}

// Global instance
export const performanceMonitor = new ChatbotPerformanceMonitor();

// Utility function to measure response time
export const measureResponseTime = async <T>(
  promise: Promise<T>,
  messageLength: number = 0,
  isCached: boolean = false
): Promise<{ result: T; responseTime: number }> => {
  const startTime = Date.now();
  const result = await promise;
  const responseTime = Date.now() - startTime;

  performanceMonitor.addMetric({
    responseTime,
    timestamp: Date.now(),
    messageLength,
    isCached,
  });

  return { result, responseTime };
};

// Performance tips based on response times
export const getPerformanceTips = (responseTime: number): string[] => {
  const tips: string[] = [];

  if (responseTime > 5000) {
    tips.push("Response is slow. Try asking a shorter question.");
    tips.push("Check your internet connection.");
  } else if (responseTime > 3000) {
    tips.push("Response is taking a while. Consider rephrasing your question.");
  } else if (responseTime < 1000) {
    tips.push("Great! Response is very fast.");
  }

  if (responseTime < 100) {
    tips.push("⚡ This was likely a cached response!");
  }

  return tips;
};