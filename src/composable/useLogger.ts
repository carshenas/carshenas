export function useLogger() {
  const logs: Array<{
    time: Date;
    type: "info" | "warn" | "error";
    message: string;
    data?: any;
  }> = [];
  const isDebugMode = true;
  const loopDetection = {
    calls: new Map<string, { count: number; lastTime: number }>(),
    threshold: 5,
    timeWindow: 2000, // 2 seconds
  };

  // New property to store active filters
  const activeFilters: Record<string, any> = {};

  function info(message: string, data?: any) {
    log("info", message, data);
  }

  function warn(message: string, data?: any) {
    log("warn", message, data);
  }

  function error(message: string, data?: any) {
    log("error", message, data);
  }

  function log(type: "info" | "warn" | "error", message: string, data?: any) {
    const logItem = {
      time: new Date(),
      type,
      message,
      data,
    };

    logs.push(logItem);

    if (isDebugMode) {
      const logMethod =
        type === "info"
          ? console.log
          : type === "warn"
          ? console.warn
          : console.error;

      logMethod(`[${logItem.time.toISOString()}] ${message}`, data || "");
    }
  }

  function detectLoop(functionName: string): boolean {
    const now = Date.now();
    const callInfo = loopDetection.calls.get(functionName) || {
      count: 0,
      lastTime: now,
    };

    // Check if call is within the time window
    if (now - callInfo.lastTime < loopDetection.timeWindow) {
      callInfo.count++;

      if (callInfo.count >= loopDetection.threshold) {
        warn(
          `⚠️ Potential loop detected in ${functionName}: ${callInfo.count} calls in ${loopDetection.timeWindow}ms`
        );
        callInfo.count = 0; // Reset counter after warning
        return true;
      }
    } else {
      // Reset counter if outside time window
      callInfo.count = 1;
    }

    callInfo.lastTime = now;
    loopDetection.calls.set(functionName, callInfo);
    return false;
  }

  function getLogs() {
    return [...logs];
  }

  function exportLogs() {
    return JSON.stringify(logs, null, 2);
  }

  function clearLogs() {
    logs.length = 0;
    loopDetection.calls.clear();
  }

  // New methods for managing active filters
  function setFilter(key: string, value: any) {
    activeFilters[key] = value;
  }

  function getFilter(key: string) {
    return activeFilters[key];
  }

  function getAllFilters() {
    return { ...activeFilters };
  }

  function clearFilters() {
    for (const key in activeFilters) {
      delete activeFilters[key];
    }
  }

  return {
    info,
    warn,
    error,
    detectLoop,
    getLogs,
    exportLogs,
    clearLogs,
    setFilter, // Expose new methods
    getFilter,
    getAllFilters,
    clearFilters,
  };
}