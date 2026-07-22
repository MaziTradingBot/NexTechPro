import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = { title: "Terms of Service — NexTechPro" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="July 2026">
      <p>
        These terms govern your use of NexTechPro and any purchase you make. By placing an order you
        agree to them.
      </p>

      <h2>Orders &amp; pricing</h2>
      <ul>
        <li>All prices are shown in Ukrainian hryvnia (₴) and include applicable taxes.</li>
        <li>An order is confirmed once you complete checkout; we&apos;ll contact you to arrange delivery.</li>
        <li>We may cancel an order if an item is unavailable or a pricing error occurs, with a full refund.</li>
      </ul>

      <h2>Payment</h2>
      <ul>
        <li>Pay by card in full, pay 15% now with the balance on delivery, or pay cash on delivery.</li>
        <li>Card payments are handled securely by our payment provider.</li>
      </ul>

      <h2>Delivery</h2>
      <p>
        We deliver across Ukraine via Nova Poshta and Meest, typically within 1–5 days. Delivery times
        are estimates and may vary.
      </p>

      <h2>Warranty</h2>
      <p>
        Products carry the manufacturer&apos;s official warranty (up to 24 months). See our{" "}
        <a href="/returns">Returns &amp; Refunds</a> page for how to make a claim.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Reach us via the <a href="/contact">Contact</a> page.
      </p>
    </LegalPage>
  );
}
