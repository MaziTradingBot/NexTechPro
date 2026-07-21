"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Lock } from "lucide-react";
import { createPaymentIntent } from "@/app/(storefront)/checkout/stripe-actions";
import { useI18n } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/dictionaries";
import { formatPrice } from "@/lib/format";

const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
export const stripeConfigured = Boolean(pk);
const stripePromise = pk ? loadStripe(pk) : null;

interface Props {
  amount: number; // UAH to charge now
  label: string;
  onValidate: () => boolean;
  onPaid: () => Promise<void>;
}

export function StripePaymentBox({ amount, label, onValidate, onPaid }: Props) {
  const { locale } = useI18n();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setClientSecret(null);
    setErr(null);
    createPaymentIntent(amount).then((r) => {
      if (!active) return;
      if (r.clientSecret) setClientSecret(r.clientSecret);
      else setErr(r.error ?? "Could not start payment.");
    });
    return () => {
      active = false;
    };
  }, [amount]);

  if (!stripePromise) return null;
  if (err) {
    return (
      <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-400">{err}</p>
    );
  }
  if (!clientSecret) {
    return <p className="py-2 text-sm text-slate-400">Loading secure payment…</p>;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "night",
          variables: {
            colorPrimary: "#00c8ff",
            colorBackground: "#0c1221",
            colorText: "#e2e8f5",
            borderRadius: "10px",
          },
        },
      }}
    >
      <PayForm amount={amount} label={label} locale={locale} onValidate={onValidate} onPaid={onPaid} />
    </Elements>
  );
}

function PayForm({
  amount,
  label,
  locale,
  onValidate,
  onPaid,
}: Props & { locale: Locale }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!onValidate()) return;
    setProcessing(true);
    setError(null);
    const { error: payError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (payError) {
      setError(payError.message ?? "Payment failed.");
      setProcessing(false);
      return;
    }
    if (paymentIntent && (paymentIntent.status === "succeeded" || paymentIntent.status === "processing")) {
      try {
        await onPaid();
      } catch {
        setError("Payment went through but the order failed to save. Contact support.");
        setProcessing(false);
      }
    } else {
      setError("Payment was not completed.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-sm font-medium text-rose-400">{error}</p>}
      <button
        type="submit"
        disabled={processing || !stripe}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl brand-gradient font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        <Lock size={16} />
        {processing ? "Processing…" : `${label} · ${formatPrice(amount, locale)}`}
      </button>
    </form>
  );
}
