import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = { title: "Returns & Refunds — NexTechPro" };

export default function ReturnsPage() {
  return (
    <LegalPage title="Returns &amp; Refunds" updated="July 2026">
      <p>
        Not happy with your purchase? Under Ukrainian consumer law you may return most items within 14
        days of receipt, provided they are unused and in their original packaging.
      </p>

      <h2>How to return an item</h2>
      <ul>
        <li>Contact us at <a href="mailto:help@nextechpro.ua">help@nextechpro.ua</a> with your order number.</li>
        <li>We&apos;ll confirm the return and share the nearest Nova Poshta / Meest drop-off details.</li>
        <li>Pack the item securely with all accessories and the receipt.</li>
      </ul>

      <h2>Refunds</h2>
      <ul>
        <li>Once we receive and inspect the item, we refund within 7 business days.</li>
        <li>Card payments are refunded to the original card; cash-on-delivery orders by bank transfer.</li>
      </ul>

      <h2>Warranty claims</h2>
      <p>
        Faulty product within the warranty period? Contact us and we&apos;ll arrange a repair,
        replacement, or refund in line with the manufacturer&apos;s official warranty (up to 24 months).
      </p>

      <h2>Non-returnable items</h2>
      <p>
        For hygiene and safety reasons, certain items (e.g. opened earphones) may be non-returnable
        unless faulty. We&apos;ll always tell you before you buy.
      </p>
    </LegalPage>
  );
}
