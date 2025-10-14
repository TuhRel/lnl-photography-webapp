import {onCall, HttpsError} from "firebase-functions/v2/https";
import {onRequest} from "firebase-functions/v2/https";
import Stripe from "stripe";
import * as admin from "firebase-admin";

admin.initializeApp();

// Initialize Stripe with your secret key
// IMPORTANT: Use Firebase Functions config or environment variables
const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
  console.error(
    "STRIPE_SECRET_KEY is not set. Please set it in functions/.env for local development or use 'firebase functions:secrets:set STRIPE_SECRET_KEY' for production."
  );
}

const stripe = new Stripe(stripeKey || "sk_test_placeholder", {
  apiVersion: "2025-09-30.clover",
});

interface CheckoutData {
  serviceId: string;
  price: number;
  serviceName: string;
}

export const createCheckoutSession = onCall<CheckoutData>(
  async (request) => {
    // Verify user is authenticated
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    const {serviceId, price, serviceName} = request.data;

    // Validate input
    if (!serviceId || !price || !serviceName) {
      throw new HttpsError(
        "invalid-argument",
        "Missing required fields"
      );
    }

    try {
      // Log environment check
      const domain = process.env.DOMAIN || "http://localhost:5173";
      console.log('Using domain:', domain);
      console.log('Stripe key available:', !!stripeKey);
      
      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: serviceName,
              },
              unit_amount: Math.round(price * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${domain}/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${domain}/services`,
        client_reference_id: request.auth.uid,
        metadata: {
          userId: request.auth.uid,
          serviceId: serviceId,
        },
      });

      return {sessionId: session.id};
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      throw new HttpsError(
        "internal",
        "Unable to create checkout session"
      );
    }
  }
);

// Webhook to handle successful payments
export const stripeWebhook = onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  let event: Stripe.Event;

  try {
    // Get raw body for webhook verification
    const rawBody = (req as any).rawBody || req.body;
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      webhookSecret
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Save session to Firestore
    await admin.firestore().collection("sessions").add({
      userId: session.metadata?.userId,
      serviceId: session.metadata?.serviceId,
      serviceName: session.metadata?.serviceName || "Photography Session",
      amount: session.amount_total,
      status: "completed",
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      photos: [], // Empty array for new sessions
      stripeSessionId: session.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  res.json({received: true});
});