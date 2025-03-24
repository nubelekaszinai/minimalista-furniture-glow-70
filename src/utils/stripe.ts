
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

// Initialize Stripe with the publishable key
let stripePromise: Promise<any> | null = null;

export const getStripe = async () => {
  if (!stripePromise) {
    const Stripe = await loadStripe();
    stripePromise = Stripe('pk_test_51R5cdT2K3ie3J8HoeWNBWipQR8EJj3mWiVak4N6U4PmyEgNorEDl9wIXUxhdwm7fRHXop0iCpfWoMVQGltAFZ9pq00JxknHWbB');
  }
  return stripePromise;
};

// Create checkout session via API and redirect to Stripe Checkout
export const createCheckoutSession = async (productId: string): Promise<string> => {
  try {
    // Send request to our checkout API endpoint
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const { id: sessionId } = await response.json();
    return sessionId;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Redirect to Stripe Checkout using the session ID
export const redirectToCheckout = async (sessionId: string): Promise<void> => {
  try {
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      console.error('Stripe redirect error:', error);
      throw new Error(error.message);
    }
  } catch (err) {
    console.error('Failed to redirect to checkout:', err);
    throw err;
  }
};
