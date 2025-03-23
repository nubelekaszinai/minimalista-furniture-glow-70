
import { createCheckoutSessionAPI } from './stripe-checkout';

// This mock API handler intercepts fetch calls to simulate API endpoints
export const setupMockApiHandler = () => {
  const originalFetch = window.fetch;
  
  window.fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    
    // Handle API routes
    if (url === '/api/create-checkout-session') {
      return createCheckoutSessionAPI(new Request(url, init));
    }
    
    // Fall back to original fetch for all other requests
    return originalFetch(input, init);
  };
};
