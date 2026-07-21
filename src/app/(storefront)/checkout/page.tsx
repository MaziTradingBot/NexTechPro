"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Truck,
  Package,
  CreditCard,
  Wallet,
  BadgePercent,
  Check,
  ShoppingBag,
  Lock,
} from "lucide-react";
import { useCartItems, useCartStore } from "@/lib/store/cart";
import { useProductsByIds } from "@/lib/useProductsByIds";
import { useI18n } from "@/lib/i18n/provider";
import { formatPrice } from "@/lib/format";
import { useMounted } from "@/lib/useMounted";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth";
import { useOrdersStore, type PaymentMethod } from "@/lib/store/orders";
import { createOrder } from "./actions";
import { StripePaymentBox, stripeConfigured } from "@/components/checkout/StripePaymentBox";
import { ProductImage } from "@/components/product/ProductImage";

const countries = ["Ukraine", "Poland", "Moldova"] as const;

// Regions/states per country — the dropdown updates to match the chosen country.
const regionsByCountry: Record<string, string[]> = {
  Ukraine: [
    "Київська", "Львівська", "Харківська", "Одеська", "Дніпропетровська",
    "Запорізька", "Вінницька", "Полтавська", "Івано-Франківська", "Тернопільська",
    "Закарпатська", "Черкаська", "Чернігівська", "Волинська", "Рівненська",
    "Хмельницька", "Житомирська", "Сумська", "Миколаївська", "Херсонська",
    "Кіровоградська", "Чернівецька",
  ],
  Poland: [
    "Dolnośląskie", "Kujawsko-Pomorskie", "Lubelskie", "Lubuskie", "Łódzkie",
    "Małopolskie", "Mazowieckie", "Opolskie", "Podkarpackie", "Podlaskie",
    "Pomorskie", "Śląskie", "Świętokrzyskie", "Warmińsko-Mazurskie",
    "Wielkopolskie", "Zachodniopomorskie",
  ],
  Moldova: [
    "Chișinău", "Bălți", "Anenii Noi", "Basarabeasca", "Briceni", "Cahul",
    "Cantemir", "Călărași", "Căușeni", "Cimișlia", "Criuleni", "Dondușeni",
    "Drochia", "Dubăsari", "Edineț", "Fălești", "Florești", "Găgăuzia",
    "Glodeni", "Hîncești", "Ialoveni", "Leova", "Nisporeni", "Ocnița", "Orhei",
    "Rezina", "Rîșcani", "Sîngerei", "Șoldănești", "Soroca", "Ștefan Vodă",
    "Strășeni", "Taraclia", "Telenești", "Ungheni",
  ],
};

// Phone dial code per country — updates when the country changes.
const dialCodes: Record<string, string> = { Ukraine: "+380", Poland: "+48", Moldova: "+373" };
const phonePlaceholders: Record<string, string> = {
  Ukraine: "+380 __ ___ __ __",
  Poland: "+48 ___ ___ ___",
  Moldova: "+373 __ ___ ___",
};

type Carrier = "novaPoshta" | "meest";

interface FormState {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  country: string;
  region: string;
  city: string;
  postalCode: string;
  carrier: Carrier;
  branch: string;
  payment: PaymentMethod;
}

export default function CheckoutPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const mounted = useMounted();
  const items = useCartItems();
  const clear = useCartStore((s) => s.clear);
  const activeUser = useCartStore((s) => s.activeUser);
  const user = useAuthStore((s) => s.user);
  const addOrder = useOrdersStore((s) => s.add);

  const products = useProductsByIds(items.map((i) => i.productId));
  const byId = new Map((products ?? []).map((p) => [p.id, p] as const));
  const lines = items
    .map((i) => ({ item: i, product: byId.get(i.productId) }))
    .filter((l) => l.product);
  const subtotal = lines.reduce((s, l) => s + l.product!.price * l.item.qty, 0);

  const [form, setForm] = useState<FormState>({
    firstName: user ? user.name.split(" ")[0] : "",
    lastName: user ? user.name.split(" ").slice(1).join(" ") : "",
    phone: "+380 ",
    email: user?.email ?? "",
    country: "Ukraine",
    region: "",
    city: "",
    postalCode: "",
    carrier: "novaPoshta",
    branch: "",
    payment: "card-prepay",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: false }));
  };

  const deliveryFee = 0;
  const total = subtotal + deliveryFee;
  const prepaid =
    form.payment === "card-prepay"
      ? Math.round(total * 0.15)
      : form.payment === "card-full"
        ? total
        : 0;
  const remaining = total - prepaid;
  const isCardPayment = form.payment !== "cod";
  const useStripeCheckout = isCardPayment && stripeConfigured;

  const validate = (): boolean => {
    const required: (keyof FormState)[] = [
      "firstName",
      "lastName",
      "phone",
      "region",
      "city",
      "postalCode",
      "branch",
    ];
    const next: Partial<Record<keyof FormState, boolean>> = {};
    required.forEach((k) => {
      if (!String(form[k]).trim()) next[k] = true;
    });
    // basic phone check: at least 9 digits
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 9) next.phone = true;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const finalizeOrder = async () => {
    setSubmitting(true);
    try {
      // The server recomputes prices from the database and saves the order.
      const result = await createOrder({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        email: form.email,
        country: form.country,
        region: form.region,
        city: form.city,
        postalCode: form.postalCode,
        carrier: form.carrier,
        branch: form.branch,
        paymentMethod: form.payment,
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        customerEmail: user?.email,
      });
      // Keep a local copy so the success & account pages work in demo mode.
      addOrder({
        id: result.orderNumber,
        userKey: activeUser,
        createdAt: Date.now(),
        items: result.items.map((it) => ({
          productId: it.productId,
          name: it.name,
          qty: it.qty,
          price: it.price,
        })),
        subtotal: result.subtotal,
        deliveryFee: result.deliveryFee,
        total: result.total,
        payment: form.payment,
        prepaid: result.prepaid,
        remaining: result.remaining,
        contact: {
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          email: form.email,
        },
        delivery: {
          country: form.country,
          region: form.region,
          city: form.city,
          postalCode: form.postalCode,
          carrier: form.carrier,
          branch: form.branch,
        },
      });
      clear();
      router.push(`/checkout/success?order=${result.orderNumber}`);
    } catch {
      setSubmitting(false);
      alert("Something went wrong placing your order. Please try again.");
      throw new Error("order-failed");
    }
  };

  const placeOrder = async () => {
    if (!validate()) {
      const el = document.querySelector("[data-error='true']");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    await finalizeOrder();
  };

  if (!mounted || (items.length > 0 && products === null)) {
    return <div className="wrap py-20 text-center text-slate-400">{t("common.loading")}</div>;
  }

  if (lines.length === 0) {
    return (
      <div className="wrap py-20">
        <div className="mx-auto max-w-md rounded-3xl border border-[var(--border)] bg-surface p-10 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-500/10 text-brand-400">
            <ShoppingBag size={30} />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-white">{t("cart.empty")}</h1>
          <Link
            href="/catalog"
            className="mt-6 inline-flex rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
          >
            {t("cart.startShopping")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap py-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-white">{t("checkout.title")}</h1>
      <p className="mt-2 flex items-start gap-2 text-sm text-slate-400">
        <BadgePercent size={16} className="mt-0.5 shrink-0 text-brand-400" />
        {t("checkout.guestNote")}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* contact */}
          <Section step="1" title={t("checkout.contactTitle")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={t("checkout.firstName")}
                value={form.firstName}
                onChange={(v) => set("firstName", v)}
                error={errors.firstName}
                errorText={t("checkout.required")}
              />
              <Field
                label={t("checkout.lastName")}
                value={form.lastName}
                onChange={(v) => set("lastName", v)}
                error={errors.lastName}
                errorText={t("checkout.required")}
              />
              <Field
                label={t("checkout.phone")}
                value={form.phone}
                onChange={(v) => set("phone", v)}
                error={errors.phone}
                errorText={t("checkout.invalidPhone")}
                placeholder={phonePlaceholders[form.country]}
                type="tel"
              />
              <Field
                label={t("checkout.email")}
                value={form.email}
                onChange={(v) => set("email", v)}
                type="email"
                optional
              />
            </div>
          </Section>

          {/* delivery */}
          <Section step="2" title={t("checkout.deliveryTitle")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>{t("checkout.country")}</FieldLabel>
                <select
                  value={form.country}
                  onChange={(e) => {
                    const c = e.target.value;
                    setForm((f) => ({ ...f, country: c, region: "", phone: `${dialCodes[c] ?? ""} ` }));
                    setErrors((er) => ({ ...er, region: false, phone: false }));
                  }}
                  className="h-12 w-full rounded-xl border border-[var(--border)] bg-surface px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
                >
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div data-error={errors.region ? "true" : undefined}>
                <FieldLabel>{t("checkout.region")}</FieldLabel>
                <select
                  value={form.region}
                  onChange={(e) => set("region", e.target.value)}
                  className={cn(
                    "h-12 w-full rounded-xl border bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-brand-500/30",
                    errors.region ? "border-rose-400" : "border-[var(--border)] focus:border-brand-500",
                  )}
                >
                  <option value="">—</option>
                  {(regionsByCountry[form.country] ?? []).map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {errors.region && <ErrorText>{t("checkout.required")}</ErrorText>}
              </div>
              <Field
                label={t("checkout.city")}
                value={form.city}
                onChange={(v) => set("city", v)}
                error={errors.city}
                errorText={t("checkout.required")}
              />
              <Field
                label={t("checkout.postalCode")}
                value={form.postalCode}
                onChange={(v) => set("postalCode", v)}
                error={errors.postalCode}
                errorText={t("checkout.required")}
                placeholder="01001"
              />
            </div>

            {/* carrier */}
            <FieldLabel className="mt-5">{t("checkout.carrier")}</FieldLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              <CarrierOption
                selected={form.carrier === "novaPoshta"}
                onClick={() => set("carrier", "novaPoshta")}
                icon={<Truck size={20} />}
                title={t("checkout.novaPoshta")}
                subtitle={t("checkout.deliveryTime")}
              />
              <CarrierOption
                selected={form.carrier === "meest"}
                onClick={() => set("carrier", "meest")}
                icon={<Package size={20} />}
                title={t("checkout.meest")}
                subtitle={t("checkout.deliveryTime")}
              />
            </div>

            <div className="mt-4" data-error={errors.branch ? "true" : undefined}>
              <Field
                label={t("checkout.branch")}
                value={form.branch}
                onChange={(v) => set("branch", v)}
                error={errors.branch}
                errorText={t("checkout.required")}
                placeholder={t("checkout.branchPlaceholder")}
              />
            </div>
          </Section>

          {/* payment */}
          <Section step="3" title={t("checkout.paymentTitle")}>
            <div className="space-y-3">
              <PaymentOption
                selected={form.payment === "card-prepay"}
                onClick={() => set("payment", "card-prepay")}
                icon={<BadgePercent size={20} />}
                title={t("checkout.cardPrepay")}
                desc={t("checkout.cardPrepayDesc")}
              />
              <PaymentOption
                selected={form.payment === "cod"}
                onClick={() => set("payment", "cod")}
                icon={<Wallet size={20} />}
                title={t("checkout.cashOnDelivery")}
                desc={t("checkout.cashOnDeliveryDesc")}
              />
              <PaymentOption
                selected={form.payment === "card-full"}
                onClick={() => set("payment", "card-full")}
                icon={<CreditCard size={20} />}
                title={t("checkout.cardFull")}
                desc={t("checkout.cardFullDesc")}
              />
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <Lock size={13} /> {t("checkout.demoPayNote")}
            </p>
          </Section>
        </div>

        {/* summary */}
        <div className="lg:sticky lg:top-40 lg:self-start">
          <div className="rounded-2xl border border-[var(--border)] bg-surface p-6">
            <h2 className="text-lg font-bold text-white">{t("checkout.orderSummary")}</h2>

            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
              {lines.map(({ item, product }) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <ProductImage product={product!} className="h-14 w-14 rounded-lg" iconClassName="h-1/2 w-1/2" />
                    <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-slate-800 px-1 text-[11px] font-bold text-white">
                      {item.qty}
                    </span>
                  </div>
                  <span className="line-clamp-2 flex-1 text-xs font-medium text-slate-200">
                    {product!.name}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {formatPrice(product!.price * item.qty, locale)}
                  </span>
                </div>
              ))}
            </div>

            <dl className="mt-5 space-y-2.5 border-t border-[var(--border)] pt-4 text-sm">
              <Row label={t("cart.subtotal")} value={formatPrice(subtotal, locale)} />
              <Row label={t("cart.delivery")} value={t("common.free")} valueClass="text-emerald-400" />
              <div className="flex items-baseline justify-between border-t border-[var(--border)] pt-3">
                <dt className="font-semibold text-white">{t("cart.total")}</dt>
                <dd className="text-xl font-bold text-white">{formatPrice(total, locale)}</dd>
              </div>

              {form.payment === "card-prepay" && (
                <div className="mt-2 space-y-1.5 rounded-xl bg-brand-500/10 p-3">
                  <Row label={t("checkout.payNow")} value={formatPrice(prepaid, locale)} valueClass="text-brand-200 font-bold" />
                  <Row label={t("checkout.remaining")} value={formatPrice(remaining, locale)} />
                </div>
              )}
            </dl>

            {useStripeCheckout ? (
              <div className="mt-6">
                <StripePaymentBox
                  amount={prepaid}
                  label={t("checkout.placeOrder")}
                  onValidate={validate}
                  onPaid={finalizeOrder}
                />
              </div>
            ) : (
              <button
                onClick={placeOrder}
                disabled={submitting}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-70"
              >
                {submitting ? (
                  t("checkout.placing")
                ) : (
                  <>
                    <Check size={18} /> {t("checkout.placeOrder")}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- sub-components ---- */
function Section({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-surface p-5 sm:p-6">
      <h2 className="mb-5 flex items-center gap-3 text-lg font-bold text-white">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-600 text-sm text-white">
          {step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function FieldLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={cn("mb-1.5 block text-sm font-medium text-slate-300", className)}>{children}</label>;
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs font-medium text-rose-500">{children}</p>;
}

function Field({
  label,
  value,
  onChange,
  error,
  errorText,
  placeholder,
  type = "text",
  optional,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
  errorText?: string;
  placeholder?: string;
  type?: string;
  optional?: boolean;
}) {
  return (
    <div data-error={error ? "true" : undefined}>
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-12 w-full rounded-xl border bg-surface px-3.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/30",
          error ? "border-rose-400" : "border-[var(--border)] focus:border-brand-500",
        )}
      />
      {error && errorText && !optional && <ErrorText>{errorText}</ErrorText>}
    </div>
  );
}

function CarrierOption({
  selected,
  onClick,
  icon,
  title,
  subtitle,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl border p-4 text-left transition",
        selected ? "border-brand-600 bg-brand-500/15 ring-1 ring-brand-200" : "border-[var(--border)] hover:border-brand-300",
      )}
    >
      <span className={cn("grid h-10 w-10 place-items-center rounded-lg", selected ? "bg-brand-600 text-white" : "bg-white/10 text-slate-400")}>
        {icon}
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-white">{title}</span>
        <span className="block text-xs text-slate-400">{subtitle}</span>
      </span>
      <span className={cn("grid h-5 w-5 place-items-center rounded-full border-2", selected ? "border-brand-600 bg-brand-600" : "border-white/15")}>
        {selected && <Check size={12} className="text-white" />}
      </span>
    </button>
  );
}

function PaymentOption({
  selected,
  onClick,
  icon,
  title,
  desc,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition",
        selected ? "border-brand-600 bg-brand-500/15 ring-1 ring-brand-200" : "border-[var(--border)] hover:border-brand-300",
      )}
    >
      <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-lg", selected ? "bg-brand-600 text-white" : "bg-white/10 text-slate-400")}>
        {icon}
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-white">{title}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-slate-400">{desc}</span>
      </span>
      <span className={cn("mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2", selected ? "border-brand-600 bg-brand-600" : "border-white/15")}>
        {selected && <Check size={12} className="text-white" />}
      </span>
    </button>
  );
}

function Row({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-slate-400">{label}</dt>
      <dd className={cn("font-semibold text-white", valueClass)}>{value}</dd>
    </div>
  );
}
