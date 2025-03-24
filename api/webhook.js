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
            return res.status(400).send('No shipping address provided.');
        }

        const city = (shippingDetails.address.city || '').toLowerCase();

        let shippingCost = 3000; // 30 EUR numatytas mokestis
        if (city.includes('šiauliai')) {
            shippingCost = 0; // Šiaulių rajone nemokamas pristatymas
        }

        try {
            await stripe.paymentIntents.update(session.payment_intent, {
                amount: session.amount_total + shippingCost,
            });

            console.log(`Updated order: New total = ${(session.amount_total + shippingCost) / 100} EUR`);
        } catch (updateError) {
            console.error('Failed to update payment intent:', updateError);
            return res.status(500).send('Failed to update payment intent.');
        }
    }

    res.status(200).json({ received: true });
};
