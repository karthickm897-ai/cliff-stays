import Link from 'next/link';

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#edf2ec_0%,#f7f6f1_44%,#f0f3ef_100%)] p-6 md:p-12 text-[var(--ink)]">
      <div className="max-w-3xl mx-auto bg-[var(--paper)] p-8 md:p-12 rounded-2xl shadow-[0_14px_30px_rgba(32,61,50,0.18)] border border-[var(--line)]">
        <h1 className="text-4xl font-semibold text-[var(--forest-900)] mb-8">Terms &amp; Conditions</h1>

        <section>
          <h2 className="text-xl font-bold text-[var(--forest-900)] mt-8 mb-4">1. Booking &amp; Reservation Policy</h2>
          <ul className="text-[#526158] leading-relaxed mb-4 list-disc pl-5 space-y-2">
            <li>Full or advance payment is required to guarantee bookings. Room capacities are strictly enforced based on the property limits displayed.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--forest-900)] mt-8 mb-4">2. Check-In &amp; Verification</h2>
          <ul className="text-[#526158] leading-relaxed mb-4 list-disc pl-5 space-y-2">
            <li>Standard check-in is 11:00 AM and check-out is 10:30 AM. Government-issued photo ID (Aadhaar, Passport, or Voter ID) is mandatory for all adult guests upon arrival.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--forest-900)] mt-8 mb-4">3. Property Rules &amp; Conduct</h2>
          <ul className="text-[#526158] leading-relaxed mb-4 list-disc pl-5 space-y-2">
            <li>Guests are expected to maintain the quiet, natural ambiance of Kodaikanal. Loud music/outdoor speakers are prohibited after 10:00 PM per local hill station regulations. Any property damage caused by negligence will be assessed and billed directly.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--forest-900)] mt-8 mb-4">4. Mountain Travel &amp; Force Majeure</h2>
          <ul className="text-[#526158] leading-relaxed mb-4 list-disc pl-5 space-y-2">
            <li>Cliff Stays is not liable for itinerary disruptions caused by road closures, power cuts due to mountain weather, or natural events beyond reasonable control.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--forest-900)] mt-8 mb-4">5. Governing Law &amp; Jurisdiction</h2>
          <ul className="text-[#526158] leading-relaxed mb-4 list-disc pl-5 space-y-2">
            <li>These terms are governed by the laws of India, subject to the jurisdiction of the courts in Dindigul District, Tamil Nadu.</li>
          </ul>
        </section>

        <Link href="/" className="inline-block mt-8 text-[var(--copper-700)] font-bold hover:underline">
          Return Home
        </Link>
      </div>
    </main>
  );
}