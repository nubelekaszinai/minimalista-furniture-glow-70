const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Map product IDs to Stripe price IDs and product information
const productMap = {
  "1": {
    priceId: "price_1R5cfu2K3ie3J8Hoph6CH4gr",
    name: "Oak Coffee Table",
    unitAmount: 14999
  },
  "2": {
    priceId: "price_1R5v9d2K3ie3J8Hob3D81g4w",
    name: "Modern Nightstand",
    unitAmount: 7999
  },
  "3": {
    priceId: "price_1R5vAB2K3ie3J8HoqqlNgwxk",
    name: "White Dresser",
    unitAmount: 19999
  }
};

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { productId } = req.body;

        if (!productId || !productMap[productId]) {
            return res.status(400).json({ error: `Invalid product ID: ${productId}` });
        }

        const product = productMap[productId];

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: { name: product.name },
                        unit_amount: product.unitAmount,
                    },
                    quantity: 1,
                },
            ],
            shipping_address_collection: {
                allowed_countries: ['LT'],
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: { amount: 0, currency: 'eur' },
                        display_name: 'Shipping (calculated at checkout)',
                    },
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.origin}/success`,
            cancel_url: `${req.headers.origin}/cancel`,
        });

        res.status(200).json({ id: session.id });
    } catch (err) {
        console.error('Stripe API error:', err);
        res.status(500).json({ error: err.message });
    }
};
