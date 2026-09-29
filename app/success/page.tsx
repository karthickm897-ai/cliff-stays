import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#edf2ec_0%,#f7f6f1_44%,#f0f3ef_100%)] flex flex-col items-center justify-center p-6 text-[var(--ink)]">
      <div className="bg-[var(--paper)] p-10 rounded-lg shadow-[0_14px_30px_rgba(32,61,50,0.18)] border border-[var(--line)] max-w-md w-full text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#c19a68]" />
        <div className="text-[#a66d43] text-6xl mb-6 font-light">✓</div>
        <h1 className="text-3xl font-semibold text-[var(--forest-900)] mb-4">Booking Confirmed</h1>
        <p className="text-[#526158] mb-8 leading-relaxed">
          Your payment has been securely verified. We look forward to welcoming you.
        </p>
        <Link
          href="/"
          className="inline-block bg-[var(--forest-900)] text-white px-8 py-3 rounded-lg font-bold shadow-[0_6px_16px_rgba(32,61,50,0.16)] hover:-translate-y-0.5 transition-transform"
        >
          Return to Home
        </Link>
      </div>
    </main>
  );
}