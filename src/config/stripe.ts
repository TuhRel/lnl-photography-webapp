import { loadStripe } from '@stripe/stripe-js';
import { getFunctions, httpsCallable } from 'firebase/functions';

// TODO: Replace with your Stripe publishable key
// Get this from Stripe Dashboard > Developers > API keys
export const stripePromise = loadStripe('pk_test_51SIAZl462EALPG2IL5f1lWQLFkrFP9Cnd4ABinsSxSVuBHcH3APwDb3YHoI3ElMoP98W1iOxMs8cxUBfAQFhyDZj00oxnyWeve');

export const createCheckoutSession = async (serviceId: string, price: number, serviceName: string) => {
  try {
    // Get Firebase Functions instance
    const functions = getFunctions();
    
    // Call the Firebase Function
    const createCheckout = httpsCallable(functions, 'createCheckoutSession');
    const result = await createCheckout({ serviceId, price, serviceName });
    
    const data = result.data as { sessionId: string };
    
    // Redirect to Stripe Checkout
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }
    
    const { error } = await stripe.redirectToCheckout({
      sessionId: data.sessionId,
    });
    
    if (error) {
      console.error('Stripe checkout error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};
