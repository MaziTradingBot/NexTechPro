import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = { title: "Privacy Policy — NexTechPro" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="July 2026">
      <p>
        NexTechPro (&quot;we&quot;, &quot;us&quot;) respects your privacy. This policy explains what
        personal data we collect, why, and your rights over it. It applies to nextechpro and our
        checkout and account services.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Contact &amp; delivery details you enter at checkout (name, phone, email, address).</li>
        <li>Order history and preferences (cart, wishlist, recently viewed).</li>
        <li>Payment is processed by our payment provider — we never store full card numbers.</li>
        <li>Basic technical data (device, cookies) to run and improve the store.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To process, deliver, and support your orders.</li>
        <li>To provide your account, wishlist, and order history.</li>
        <li>To improve the store and, with your consent, send offers you can opt out of anytime.</li>
      </ul>

      <h2>Sharing</h2>
      <p>
        We share only what&apos;s needed with delivery carriers (Nova Poshta, Meest) and our payment
        processor to fulfil your order. We do not sell your personal data.
      </p>

      <h2>Your rights</h2>
      <p>
        You can request access to, correction, or deletion of your data, and withdraw marketing
        consent, by contacting us at <a href="mailto:help@nextechpro.ua">help@nextechpro.ua</a>.
      </p>

      <h2>Cookies</h2>
      <p>
        Essential cookies keep the store working (cart, session). Optional cookies help us understand
        usage. You can choose your preference in the cookie banner.
      </p>
    </LegalPage>
  );
}
