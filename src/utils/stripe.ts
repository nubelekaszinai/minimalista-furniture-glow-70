
// Load the Stripe.js script
const loadStripe = (): Promise<any> => {
  if ((window as any).Stripe) {
    return Promise.resolve((window as any).Stripe);
  }

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.onload = () => {
      resolve((window as any).Stripe);
    };
    document.head.appendChild(script);
  });
};

// Map product IDs to Stripe price IDs
const productToPriceMap: Record<string, string> = {
  "1": "price_1R5cfu2K3ie3J8Hoph6CH4gr",
  "2": "price_1R5v9d2K3ie3J8Hob3D81g4w",
  "3": "price_1R5vAB2K3ie3J8HoqqlNgwxk"
};

// Initialize Stripe with the publishable key
let stripePromise: Promise<any> | null = null;

export const getStripe = async () => {
  if (!stripePromise) {
    const Stripe = await loadStripe();
    stripePromise = Stripe('pk_test_51R5cdT2K3ie3J8HoeWNBWipQR8EJj3mWiVak4N6U4PmyEgNorEDl9wIXUxhdwm7fRHXop0iCpfWoMVQGltAFZ9pq00JxknHWbB');
  }
  return stripePromise;
};

// Create a checkout session directly
export const redirectToCheckout = async (productId: string) => {
  const priceId = productToPriceMap[productId];
  
  if (!priceId) {
    console.error(`No price ID found for product ID: ${productId}`);
    return;
  }

  try {
    // Instead of using redirectToCheckout, create a checkout session URL and redirect
    const stripe = await getStripe();
    
    // Create a URL with query parameters for the Stripe checkout
    const baseUrl = 'https://checkout.stripe.com/c/pay';
    const successUrl = encodeURIComponent(`${window.location.origin}/success`);
    const cancelUrl = encodeURIComponent(`${window.location.origin}/cancel`);
    
    // Build the checkout URL
    const checkoutUrl = `${baseUrl}/${priceId}?locale=en&success_url=${successUrl}&cancel_url=${cancelUrl}`;
    
    // Redirect to Stripe checkout
    window.location.href = checkoutUrl;
  } catch (err) {
    console.error('Failed to redirect to checkout:', err);
  }
};
