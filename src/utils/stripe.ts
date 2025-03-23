
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

// Redirect to Stripe Checkout
export const redirectToCheckout = async (productId: string) => {
  const priceId = productToPriceMap[productId];
  
  if (!priceId) {
    console.error(`No price ID found for product ID: ${productId}`);
    return;
  }

  try {
    // Create a Checkout Session URL
    const stripe = await getStripe();
    
    // Create a checkout session with Stripe
    const { error, id } = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${window.location.origin}/success`,
      cancel_url: `${window.location.origin}/cancel`,
    });

    if (error) {
      console.error('Error creating checkout session:', error);
      throw new Error(error.message);
    }

    // Redirect to checkout
    const result = await stripe.redirectToCheckout({
      sessionId: id
    });

    if (result.error) {
      console.error('Stripe checkout error:', result.error);
      throw new Error(result.error.message);
    }
  } catch (err) {
    console.error('Failed to redirect to checkout:', err);
    throw err;
  }
};
