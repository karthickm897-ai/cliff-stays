import Link from 'next/link';

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#edf2ec_0%,#f7f6f1_44%,#f0f3ef_100%)] p-6 md:p-12 text-[var(--ink)]">
      <div className="max-w-3xl mx-auto bg-[var(--paper)] p-8 md:p-12 rounded-2xl shadow-[0_14px_30px_rgba(32,61,50,0.18)] border border-[var(--line)]">
        <h1 className="text-4xl font-semibold text-[var(--forest-900)] mb-8">Cancellation &amp; Refund Policy</h1>

        <section>
          <h2 className="text-xl font-bold text-[var(--forest-900)] mt-8 mb-4">Standard Cancellation Tiers</h2>
          <ul className="text-[#526158] leading-relaxed mb-4 list-disc pl-5 space-y-2">
            <li>7+ Days Before Check-in: Full refund minus a 3% payment gateway processing fee.</li>
            <li>3 to 7 Days Before Check-in: 50% refund.</li>
            <li>Less than 3 Days (72 Hours) Before Check-in: No refund.</li>
            <li>No-Shows &amp; Early Departures: No refunds.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--forest-900)] mt-8 mb-4">Refund Processing Timeline</h2>
          <ul className="text-[#526158] leading-relaxed mb-4 list-disc pl-5 space-y-2">
            <li>Refunds are initiated immediately upon approval.</li>
            <li>Please allow 5-7 working days for the refund to reflect in your bank account.</li>
            <li>The amount will be reversed to the original payment method used in making the payment. We cannot process refunds to alternative bank accounts.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--forest-900)] mt-8 mb-4">Weather &amp; Unforeseen Circumstances</h2>
          <ul className="text-[#526158] leading-relaxed mb-4 list-disc pl-5 space-y-2">
            <li>Cancellations due to rain, fog, or personal travel delays are subject to standard tiers.</li>
            <li>For government-mandated travel restrictions or severe natural disasters blocking access, we offer free date modification or a full refund.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--forest-900)] mt-8 mb-4">Contact Us</h2>
          <ul className="text-[#526158] leading-relaxed mb-4 list-disc pl-5 space-y-2">
            <li>Email: <a className="hover:underline" href="mailto:cliffstays@gmail.com">cliffstays@gmail.com</a></li>
            <li>Call: <a className="hover:underline" href="tel:+917094151382">+91 70941 51382</a></li>
            <li>WhatsApp: <a className="hover:underline" href="https://wa.me/917094151382">+91 70941 51382</a></li>
          </ul>
        </section>

        <Link href="/" className="inline-block mt-8 text-[var(--copper-700)] font-bold hover:underline">
          Return Home
        </Link>
      </div>
    </main>
  );
}