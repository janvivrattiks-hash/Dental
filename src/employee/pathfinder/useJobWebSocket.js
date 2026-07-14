import { useEffect } from 'react';
import { RESOLVED_BASE_URL } from '../../Script/api';

// Derive the WebSocket origin from the REST base URL (http→ws, https→wss).
// Ported from the standalone pathfinder app, which used a dedicated
// VITE_WS_BASE; here we reuse RESOLVED_BASE_URL so both share one backend host.
const WS_BASE = RESOLVED_BASE_URL.replace(/^http/, 'ws');

export function useJobWebSocket(jobId, onMessage) {
  useEffect(() => {
    if (!jobId) return;

    // The browser WebSocket API can't set Authorization headers, so pass the
    // employee bearer token as a query param for the backend to authenticate.
    const token = sessionStorage.getItem('employee_token');
    const url = `${WS_BASE}/api/ws/jobs/${jobId}${token ? `?token=${encodeURIComponent(token)}` : ''}`;
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data); // Use a callback to update parent state
      } catch (err) {
        console.error("WebSocket message parse error:", err);
      }
    };

    return () => {
      ws.close();
    };
  }, [jobId, onMessage]);
}
