const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

module.exports = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook error:', err.message);
        return res.status(400).send(`Webhook error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const shippingDetails = session.shipping_details;

        if (!shippingDetails || !shippingDetails.address) {
            console.error('No shipping address provided.');
            return res.status(400).send('No shipping address provided.');
        }

        const city = (shippingDetails.address.city || '').toLowerCase();

        let shippingCost = 3000; // 30 EUR numatytas mokestis
        if (city.includes('šiauliai')) {
            shippingCost = 0; // Šiaulių rajone nemokamas pristatymas
        }

        if (shippingCost > 0) {
            try {
                // Sukuriame papildomą mokėjimo užklausą su siuntimo mokesčiu
                await stripe.paymentIntents.create({
                    amount: shippingCost,
                    currency: 'eur',
                    customer: session.customer,
                    description: 'Shipping fee',
                    payment_method: session.payment_method,
                    confirm: true,
                });

                console.log(`Applied shipping charge: ${shippingCost / 100} EUR`);
            } catch (error) {
                console.error('Failed to charge shipping fee:', error);
                return res.status(500).send('Failed to charge shipping fee.');
            }
        }
    }

    res.status(200).json({ received: true });
};
