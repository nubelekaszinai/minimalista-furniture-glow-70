const stripe = require('stripe')('sk_test_51R5cdT2K3ie3J8HoQb8YdLr06na5UxJaSTIZCvZeoHd8HvmZYRfImpe7LFCGY52lWlItRWg8PwtNdm0MN7yQmzYa006fw6AjC0');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'eur',
                            product_data: {
                                name: 'Product Example',
                            },
                            unit_amount: 2000,
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `https://minimalista-furniture-glow-70.vercel.app/success`,
                cancel_url: `https://minimalista-furniture-glow-70.vercel.app/cancel`,
            });
            res.status(200).json({ id: session.id });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};

