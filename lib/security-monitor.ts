// Security monitoring disabled - no restrictions
export class SecurityMonitor {
  private static instance: SecurityMonitor

  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor()
    }
    return SecurityMonitor.instance
  }

  // All monitoring methods disabled
  startMonitoring() {
    // No monitoring
  }

  stopMonitoring() {
    // No monitoring to stop
  }

  checkViolation() {
    return false // Never report violations
  }

  getViolationCount() {
    return 0 // Always return 0 violations
  }

  resetViolations() {
    // Nothing to reset
  }

  isBlocked() {
    return false // Never block access
  }
}

export const securityMonitor = SecurityMonitor.getInstance()
