// Central HTTP client with simulated latency and auth interceptors

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('labtrack_auth_token') || 'institutional_mock_token_jwt';
    this.currentRole = localStorage.getItem('labtrack_active_role') || 'Student';
    this.currentPrn = localStorage.getItem('labtrack_active_prn') || '202401048';
  }

  setAuth(token, role, prn) {
    this.token = token;
    this.currentRole = role;
    this.currentPrn = prn;
    localStorage.setItem('labtrack_auth_token', token);
    localStorage.setItem('labtrack_active_role', role);
    localStorage.setItem('labtrack_active_prn', prn);
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
      'X-Institutional-PRN': this.currentPrn,
      'X-Institutional-Role': this.currentRole,
    };
  }

  // Simulates network latency with asynchronous promise
  async simulatedFetch(actionName, payloadFn, delayMs = 120) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = payloadFn();
        resolve({
          status: 200,
          ok: true,
          action: actionName,
          timestamp: new Date().toISOString(),
          data: result,
        });
      }, delayMs);
    });
  }
}

export const apiClient = new ApiClient();
