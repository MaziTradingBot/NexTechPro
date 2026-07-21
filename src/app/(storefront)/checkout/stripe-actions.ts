"use server";

import { stripe } from "@/lib/stripe";

/** Creates a Stripe PaymentIntent for the given UAH amount and returns its client secret. */
export async function createPaymentIntent(
  amountUAH: number,
): Promise<{ clientSecret?: string; error?: string }> {
  if (!stripe) return { error: "Stripe is not configured." };
  const amount = Math.max(1, Math.round(amountUAH * 100)); // amount in kopiykas
  try {
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: "uah",
      payment_method_types: ["card"],
    });
    return { clientSecret: intent.client_secret ?? undefined };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not start payment." };
  }
}
