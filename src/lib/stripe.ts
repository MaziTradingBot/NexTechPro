import "server-only";
import Stripe from "stripe";

// Only initialised when a secret key is present, so the app runs fine without Stripe.
const key = process.env.STRIPE_SECRET_KEY;
export const stripe = key ? new Stripe(key) : null;
