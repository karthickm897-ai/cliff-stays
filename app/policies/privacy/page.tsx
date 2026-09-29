import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#edf2ec_0%,#f7f6f1_44%,#f0f3ef_100%)] p-6 md:p-12 text-[var(--ink)]">
      <div className="max-w-3xl mx-auto bg-[var(--paper)] p-8 md:p-12 rounded-2xl shadow-[0_14px_30px_rgba(32,61,50,0.18)] border border-[var(--line)]">
        <h1 className="text-4xl font-semibold text-[var(--forest-900)] mb-8">Privacy Policy</h1>

        <section>
          <h2 className="text-xl font-bold text-[var(--forest-900)] mt-8 mb-4">1. Information We Collect</h2>
          <ul className="text-[#526158] leading-relaxed mb-4 list-disc pl-5 space-y-2">
            <li>Guest names, email addresses, phone numbers, and travel dates submitted during booking.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--forest-900)] mt-8 mb-4">2. Payment Data Security</h2>
          <ul className="text-[#526158] leading-relaxed mb-4 list-disc pl-5 space-y-2">
            <li>All financial transactions are securely processed through Razorpay. Cliff Stays does not store credit card numbers, CVVs, UPI PINs, or banking credentials on our servers.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--forest-900)] mt-8 mb-4">3. How We Use Information</h2>
          <ul className="text-[#526158] leading-relaxed mb-4 list-disc pl-5 space-y-2">
            <li>Contact details are used strictly to send booking vouchers, provide check-in coordinates, coordinate property access via WhatsApp/phone, and handle support. We do not sell or rent guest information to third-party marketers.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--forest-900)] mt-8 mb-4">4. Data Retention</h2>
          <ul className="text-[#526158] leading-relaxed mb-4 list-disc pl-5 space-y-2">
            <li>Reservation records are retained only as long as necessary for tax compliance, accounting, and dispute resolution.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--forest-900)] mt-8 mb-4">5. Contact for Privacy Inquiries</h2>
          <ul className="text-[#526158] leading-relaxed mb-4 list-disc pl-5 space-y-2">
            <li>Direct any data or privacy questions to <a className="hover:underline" href="mailto:cliffstays@gmail.com">cliffstays@gmail.com</a>.</li>
          </ul>
        </section>

        <Link href="/" className="inline-block mt-8 text-[var(--copper-700)] font-bold hover:underline">
          Return Home
        </Link>
      </div>
    </main>
  );
}