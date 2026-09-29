'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const MotionImage = motion.create(Image);

const imageVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 40 : -40, scale: 1.015 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -40 : 40, scale: 0.995 }),
};

const PROPERTIES = [
  {
    id: 'palm-stay',
    name: 'Palm Stay',
    score: '9.2',
    reviews: '48 reviews',
    totalRooms: 8,
    description: 'A spacious estate located in Kodaikanal featuring an open lawn and peaceful surroundings. Ideal for families and groups looking for a private getaway.',
    facilities: ['24-hour hot water', 'Wi-Fi', 'Home-style food', 'Car parking', 'Room heaters', 'Lawn', 'Campfire', 'CCTV'],
    calculatePrice: (rooms: number, nights: number) => {
      const rates = [0, 3500, 7000, 10000, 13500, 17000, 20000, 23500, 26500];
      const baseRate = rooms <= 8 ? rates[rooms] : 26500;
      return baseRate * nights;
    },
    images: [
      '/properties/palm-stay-1.jpg',
      '/properties/palm-stay-2.jpg',
      '/properties/palm-stay-3.jpg',
      '/properties/palm-stay-4.jpg',
      '/properties/palm-stay-5.jpg',
      '/properties/palm-stay-6.jpg'
    ]
  },
  {
    id: 'container-house',
    name: 'Container House',
    score: '8.8',
    reviews: '31 reviews',
    totalRooms: 6,
    description: 'Custom architectural stay offering cozy container suites set amidst quiet mountain forestry in Kodaikanal.',
    facilities: ['24-hour hot water', 'Wi-Fi', 'Home-style food', 'Car parking', 'Room heaters', 'Campfire', 'CCTV'],
    calculatePrice: (rooms: number, nights: number) => (rooms * 2000) * nights,
    images: [
      '/properties/container-house-1.jpg',
      '/properties/container-house-2.jpg',
      '/properties/container-house-3.jpg',
      '/properties/container-house-4.jpg',
      '/properties/container-house-5.jpg',
      '/properties/container-house-6.jpg'
    ]
  },
  {
    id: 'cloud-rest-garden-villa',
    name: 'Cloud Rest Garden Villa',
    score: '9.5',
    reviews: '52 reviews',
    totalRooms: 6,
    description: 'A private garden villa offering extensive outdoor grounds, recreational spaces, and sweeping valley mist.',
    facilities: ['24-hour hot water', 'Wi-Fi', 'Home-style food', 'Car parking', 'Room heaters', 'Lawn', 'Campfire', 'Kids\' play area', 'CCTV'],
    calculatePrice: (rooms: number, nights: number) => (rooms * 2500) * nights,
    images: [
      '/properties/cloud-rest-1.jpg',
      '/properties/cloud-rest-2.jpg',
      '/properties/cloud-rest-3.jpg',
      '/properties/cloud-rest-4.jpg',
      '/properties/cloud-rest-5.jpg',
      '/properties/cloud-rest-6.jpg'
    ]
  }
];

type RazorpayPaymentResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayPaymentFailure = {
  error: {
    description: string;
  };
};

type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void | Promise<void>;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
};

type RazorpayCheckoutInstance = {
  on: (event: 'payment.failed', callback: (response: RazorpayPaymentFailure) => void) => void;
  open: () => void;
};

type RazorpayWindow = Window & {
  Razorpay: new (options: RazorpayCheckoutOptions) => RazorpayCheckoutInstance;
};

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function HomePage() {
  const [searchParams, setSearchParams] = useState({
    rooms: 1,
    checkIn: '',
    checkOut: ''
  });
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [bookingProperty, setBookingProperty] = useState<(typeof PROPERTIES)[number] | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState<Record<string, number>>({});
  const [imageDirection, setImageDirection] = useState<Record<string, number>>({});
  const [isProcessing, setIsProcessing] = useState('');
  const [bookingConfirmation, setBookingConfirmation] = useState('');

  const calculateNights = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(`${checkIn}T00:00:00`);
    const end = new Date(`${checkOut}T00:00:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) return 1;
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights(searchParams.checkIn, searchParams.checkOut);

  const handleBooking = (property: (typeof PROPERTIES)[number]) => {
    const checkIn = new Date(`${searchParams.checkIn}T00:00:00`);
    const checkOut = new Date(`${searchParams.checkOut}T00:00:00`);
    
    if (!searchParams.checkIn || !searchParams.checkOut || Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime()) || checkIn >= checkOut) {
      alert('Please select valid check-in and check-out dates.');
      return;
    }
    
    if (searchParams.rooms > property.totalRooms) {
      alert(`Sorry, ${property.name} only has ${property.totalRooms} rooms available.`);
      return;
    }

    setBookingProperty(property);
  };

  const handlePayment = async () => {
    const property = bookingProperty;
    if (!property) return;

    if (!guestName.trim() || !guestPhone.trim()) {
      alert('Please enter the guest name and phone number.');
      return;
    }

    setIsProcessing(property.id);

    try {
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error('Razorpay is not configured');
      }

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Payment gateway failed to load. Please check your connection.');
        setIsProcessing('');
        return;
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          roomCount: searchParams.rooms,
          checkIn: searchParams.checkIn,
          checkOut: searchParams.checkOut
        })
      });

      const orderData = await res.json();
      
      if (!res.ok) {
        throw new Error(orderData.error || 'Failed to initialize checkout');
      }

      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Cliff Stays',
        description: `Reservation for ${property.name}`,
        order_id: orderData.orderId,
        handler: async (response: RazorpayPaymentResponse) => {
          try {
            const verifyResponse = await fetch('/api/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                guestName: guestName.trim(),
                guestPhone: guestPhone.trim(),
                propertyId: property.id,
                checkIn: searchParams.checkIn,
                checkOut: searchParams.checkOut,
              }),
            });
            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.success) {
              window.location.href = '/success';
            } else {
              alert('Payment verification failed. Please contact support before retrying.');
            }
          } catch {
            alert('Payment verification failed. Please contact support before retrying.');
          }
        },
        prefill: {
          name: guestName.trim(),
          email: "guest@example.com",
          contact: guestPhone.trim()
        },
        theme: {
          color: "#203d32"
        }
      };

      const RazorpayConstructor = (window as unknown as RazorpayWindow).Razorpay;
      const paymentObject = new RazorpayConstructor(options);
      
      paymentObject.on('payment.failed', (response: RazorpayPaymentFailure) => {
        alert(`Payment failed: ${response.error.description}`);
      });
      
      paymentObject.open();

    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : 'Checkout initialization failed');
    } finally {
      setIsProcessing('');
    }
  };

  const nextImage = (propertyId: string, max: number) => {
    setImageDirection((current) => ({ ...current, [propertyId]: 1 }));
    setActiveImageIdx(prev => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) + 1) % max
    }));
  };

  const prevImage = (propertyId: string, max: number) => {
    setImageDirection((current) => ({ ...current, [propertyId]: -1 }));
    setActiveImageIdx(prev => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) - 1 + max) % max
    }));
  };

  const showImage = (propertyId: string, imageIndex: number) => {
    const currentIndex = activeImageIdx[propertyId] ?? 0;
    setImageDirection((current) => ({ ...current, [propertyId]: imageIndex >= currentIndex ? 1 : -1 }));
    setActiveImageIdx((current) => ({ ...current, [propertyId]: imageIndex }));
  };

  return (
    <>
    <main className="min-h-screen bg-[linear-gradient(180deg,#edf2ec_0%,#f7f6f1_44%,#f0f3ef_100%)] text-[var(--ink)]">
      <header className="relative isolate min-h-[280px] overflow-hidden bg-[#203d32] text-white md:min-h-[360px]">
        <Image
          src="/properties/head.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_58%]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(21,39,31,0.82)_0%,rgba(21,39,31,0.52)_48%,rgba(21,39,31,0.08)_100%),linear-gradient(0deg,rgba(21,39,31,0.34)_0%,transparent_55%)]" />
        <div className="relative mx-auto flex min-h-[280px] max-w-[1240px] flex-col justify-end px-4 py-8 md:min-h-[360px] md:px-5 md:py-12">
          <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#f0c5a8] before:h-px before:w-[22px] before:bg-current before:content-['']">
            Kodaikanal · Tamil Nadu
          </p>
          <h1 className="mt-3 text-5xl font-semibold leading-none text-white md:text-7xl">Cliff Stays</h1>
          <p className="mt-3 text-base font-medium text-white/90 md:text-xl">Find your mountain escape</p>
        </div>
      </header>

      <section className="mx-auto max-w-[1240px] p-2 md:px-5 md:pb-[60px] md:pt-8">
        <div className="relative mb-8 overflow-hidden rounded-lg border border-[#9a7855] bg-[#203d32] p-2 shadow-[0_14px_30px_rgba(32,61,50,0.18)] before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-[#c19a68] before:content-[''] md:p-5">
          <div className="grid grid-cols-3 gap-2">
            <label className="flex min-w-0 flex-col gap-1 text-[10px] font-semibold leading-tight text-[#e8e7dc] md:gap-2 md:text-[13px] md:leading-normal">
              Rooms
              <select
                value={searchParams.rooms}
                onChange={(event) => setSearchParams((current) => ({ ...current, rooms: Number(event.target.value) }))}
                className="min-w-0 w-full rounded-lg border border-[#d8d1c2] bg-[#f8f5ed] px-1.5 py-2 text-xs text-[#26352d] md:px-3.5 md:py-2.5 md:text-base"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((room) => (
                  <option key={room} value={room}>{room} room{room > 1 ? 's' : ''}</option>
                ))}
              </select>
            </label>
            <label className="flex min-w-0 flex-col gap-1 text-[10px] font-semibold leading-tight text-[#e8e7dc] md:gap-2 md:text-[13px] md:leading-normal">
              Check in
              <input
                type="date"
                value={searchParams.checkIn}
                max={searchParams.checkOut || undefined}
                onChange={(event) => setSearchParams((current) => ({ ...current, checkIn: event.target.value }))}
                className="min-w-0 w-full rounded-lg border border-[#d8d1c2] bg-[#f8f5ed] px-1.5 py-2 text-xs text-[#26352d] md:px-3.5 md:py-2.5 md:text-base"
              />
            </label>
            <label className="flex min-w-0 flex-col gap-1 text-[10px] font-semibold leading-tight text-[#e8e7dc] md:gap-2 md:text-[13px] md:leading-normal">
              Check out
              <input
                type="date"
                value={searchParams.checkOut}
                min={searchParams.checkIn || undefined}
                onChange={(event) => setSearchParams((current) => ({ ...current, checkOut: event.target.value }))}
                className="min-w-0 w-full rounded-lg border border-[#d8d1c2] bg-[#f8f5ed] px-1.5 py-2 text-xs text-[#26352d] md:px-3.5 md:py-2.5 md:text-base"
              />
            </label>
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-3 border-b border-[var(--line)] pb-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg text-[var(--forest-900)] md:text-3xl">Stay options</h2>
          <div className="flex items-center gap-2 self-end md:ml-auto">
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-[#9a7855]/50 bg-[#203d32] px-4 py-2 text-sm font-semibold text-[#f0c5a8] transition-colors hover:bg-[#315847] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#203d32]"
            >
              Contact
            </a>
            <div className="w-fit rounded-full bg-[var(--copper-100)] px-3.5 py-2 font-bold text-[var(--copper-700)]">
              {nights} night{nights > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        <div className="grid gap-[22px]">
          {PROPERTIES.map((property) => {
            const exceedsAvailability = searchParams.rooms > property.totalRooms;
            const totalPrice = exceedsAvailability ? null : property.calculatePrice(searchParams.rooms, nights);
            const imageIndex = activeImageIdx[property.id] ?? 0;

            return (
              <article id={property.id} key={property.id} className="overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--paper)] shadow-[0_6px_20px_rgba(32,61,50,0.06)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(32,61,50,0.11)]">
                <div className="grid grid-cols-1 md:grid-cols-[420px_minmax(0,1fr)]">
                  <div className="group relative h-64 overflow-hidden md:h-[420px]">
                    <AnimatePresence initial={false} mode="wait" custom={imageDirection[property.id] ?? 1}>
                      <MotionImage
                        key={property.images[imageIndex]}
                        src={property.images[imageIndex]}
                        alt={property.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 420px"
                        quality={95}
                        custom={imageDirection[property.id] ?? 1}
                        variants={imageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                        style={{ objectFit: 'cover' }}
                      />
                    </AnimatePresence>
                    <button
                      type="button"
                      aria-label={`Previous image of ${property.name}`}
                      onClick={() => prevImage(property.id, property.images.length)}
                      className="group/previous absolute left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center text-[28px] font-light leading-none text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] transition-[opacity,transform] duration-300 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:pointer-events-none md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:opacity-100 md:group-focus-within:pointer-events-auto md:group-focus-within:opacity-100"
                    >
                      <span aria-hidden="true" className="transition-transform duration-300 ease-out group-hover/previous:-translate-x-1">‹</span>
                    </button>
                    <button
                      type="button"
                      aria-label={`Next image of ${property.name}`}
                      onClick={() => nextImage(property.id, property.images.length)}
                      className="group/next absolute right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center text-[28px] font-light leading-none text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] transition-[opacity,transform] duration-300 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:pointer-events-none md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:opacity-100 md:group-focus-within:pointer-events-auto md:group-focus-within:opacity-100"
                    >
                      <span aria-hidden="true" className="transition-transform duration-300 ease-out group-hover/next:translate-x-1">›</span>
                    </button>
                    <div
                      role="group"
                      aria-label={`Choose an image of ${property.name}`}
                      className="pointer-events-auto absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-0.5 opacity-100 transition-opacity duration-300 md:pointer-events-none md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:opacity-100 md:group-focus-within:pointer-events-auto md:group-focus-within:opacity-100"
                    >
                      {property.images.map((image, slideIndex) => (
                        <button
                          key={image}
                          type="button"
                          aria-label={`Show image ${slideIndex + 1} of ${property.name}`}
                          aria-pressed={imageIndex === slideIndex}
                          onClick={() => showImage(property.id, slideIndex)}
                          className="flex size-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
                        >
                          <span
                            aria-hidden="true"
                            className={`h-1.5 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.65)] transition-[width,background-color] duration-300 ${imageIndex === slideIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/65'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between gap-5 p-5 md:p-8">
                    <div>
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="mb-1.5 text-2xl text-[var(--forest-900)] md:text-3xl">{property.name}</h3>
                          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#eadbc7] bg-[#f8f2e8] px-3 py-1.5 text-sm text-[var(--muted)]">
                            <span className="text-lg text-[#a66d43]">★</span>
                            <strong className="text-lg text-[var(--forest-900)]">{property.score}</strong>
                            <span>{property.reviews}</span>
                          </div>
                        </div>
                        <div className="text-left md:text-right">
                          <div className="text-xs uppercase tracking-[0.08em] text-[var(--muted)]">Total price</div>
                          <div className={`text-3xl font-extrabold ${totalPrice === null ? 'text-[var(--muted)]' : 'text-[var(--forest-900)]'}`}>
                            {totalPrice === null ? 'Unavailable' : `₹${totalPrice.toLocaleString('en-IN')}`}
                          </div>
                          <div className="text-[13px] text-[var(--muted)]">for {nights} night{nights > 1 ? 's' : ''}</div>
                        </div>
                      </div>
                      <p className="mt-4 leading-[1.7] text-[#526158]">{property.description}</p>
                    </div>

                    <div>
                      <div className="mb-4 flex flex-wrap gap-2">
                        {property.facilities.map((facility) => (
                          <span key={facility} className="rounded-full bg-[var(--sage-100)] px-2.5 py-2 text-xs font-semibold text-[var(--forest-700)]">
                            {facility}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center">
                        <div className="text-sm text-[var(--muted)]">
                          {exceedsAvailability
                            ? `${searchParams.rooms} requested · only ${property.totalRooms} available`
                            : `${property.totalRooms} rooms available · ${searchParams.rooms} selected`}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleBooking(property)}
                          disabled={isProcessing === property.id || exceedsAvailability}
                          className={`booking-action w-full min-w-[180px] rounded-lg border-0 px-[22px] py-[14px] text-base font-bold shadow-[0_6px_16px_rgba(32,61,50,0.16)] md:w-auto ${isProcessing === property.id || exceedsAvailability ? 'cursor-not-allowed bg-[#e2e8e1]' : 'cursor-pointer bg-[var(--forest-900)]'}`}
                        >
                          {isProcessing === property.id
                            ? 'Processing...'
                            : exceedsAvailability
                              ? 'Unavailable'
                              : 'Book this stay'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <AnimatePresence>
        {bookingProperty && (
          <motion.div
            key="guest-details-backdrop"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !isProcessing) {
                setBookingProperty(null);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && !isProcessing) {
                setBookingProperty(null);
              }
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-[#14261f]/70 p-4"
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="guest-details-heading"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="my-auto w-full max-w-md rounded-lg border border-[var(--line)] bg-[var(--paper)] p-6 shadow-[0_14px_30px_rgba(32,61,50,0.28)] md:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id="guest-details-heading" className="text-2xl font-semibold text-[var(--forest-900)]">Guest details</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">{bookingProperty.name}</p>
                </div>
                <button
                  type="button"
                  aria-label="Close guest details"
                  onClick={() => setBookingProperty(null)}
                  disabled={Boolean(isProcessing)}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-xl text-[var(--muted)] hover:bg-[var(--sage-100)] hover:text-[var(--forest-900)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ×
                </button>
              </div>

              <p className="mt-4 text-sm leading-6 text-[#526158]">
                {searchParams.rooms} room{searchParams.rooms > 1 ? 's' : ''} · {nights} night{nights > 1 ? 's' : ''} · {searchParams.checkIn} to {searchParams.checkOut}
              </p>

              <form
                className="mt-6 space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handlePayment();
                }}
              >
                <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--forest-900)]">
                  Guest name
                  <input
                    type="text"
                    autoComplete="name"
                    autoFocus
                    required
                    value={guestName}
                    onChange={(event) => setGuestName(event.target.value)}
                    className="w-full rounded-lg border border-[#d8d1c2] bg-[#f8f5ed] px-3.5 py-3 text-base font-normal text-[#26352d]"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--forest-900)]">
                  Phone number
                  <input
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    required
                    value={guestPhone}
                    onChange={(event) => setGuestPhone(event.target.value)}
                    className="w-full rounded-lg border border-[#d8d1c2] bg-[#f8f5ed] px-3.5 py-3 text-base font-normal text-[#26352d]"
                  />
                </label>
                <button
                  type="submit"
                  disabled={Boolean(isProcessing)}
                  className="w-full rounded-lg bg-[var(--forest-900)] px-5 py-3 font-bold text-white transition-colors hover:bg-[var(--forest-700)] disabled:cursor-wait disabled:opacity-70"
                >
                  {isProcessing ? 'Preparing payment...' : `Pay ₹${bookingProperty.calculatePrice(searchParams.rooms, nights).toLocaleString('en-IN')}`}
                </button>
              </form>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bookingConfirmation && (
          <motion.aside
            key="booking-confirmation"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="fixed bottom-4 right-4 z-[100] flex w-[min(420px,calc(100vw-2rem))] items-start gap-3 rounded-lg border border-[#d6e2d5] bg-white p-4 text-[var(--ink)] shadow-[0_12px_36px_rgba(32,61,50,0.2)] md:bottom-6 md:right-6"
          >
            <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--sage-100)] text-lg font-bold text-[var(--forest-700)]">
              ✓
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="font-semibold text-[var(--forest-900)]">Booking confirmed</p>
              <p className="mt-0.5 text-sm leading-5 text-[var(--muted)]">
                Payment securely verified for {bookingConfirmation}.
              </p>
            </div>
            <button
              type="button"
              aria-label="Dismiss booking confirmation"
              onClick={() => setBookingConfirmation('')}
              className="-mr-1 -mt-1 flex size-8 shrink-0 items-center justify-center rounded-full text-xl text-[var(--muted)] hover:bg-[var(--sage-100)] hover:text-[var(--forest-900)]"
            >
              ×
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </main>
    <footer className="bg-[#203d32] text-[#e8e7dc]">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-8 border-t border-[#9a7855]/30 px-5 py-12 md:grid-cols-4">
        <section aria-labelledby="footer-brand-heading">
          <h2 id="footer-brand-heading" className="text-2xl font-semibold text-[#e8e7dc]">Cliff Stays</h2>
          <p className="mt-1 text-sm font-medium text-[#c19a68]">Kodaikanal, Tamil Nadu</p>
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/80">
            Handpicked, secluded cottages and estates across the misty hills of Kodaikanal. Built for peaceful mountain escapes.
          </p>
        </section>

        <nav aria-labelledby="footer-stays-heading">
          <h2 id="footer-stays-heading" className="text-lg font-semibold text-[#f0c5a8]">Featured Stays</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li><a className="transition-colors hover:text-[#f0c5a8]" href="#palm-stay">Palm Stay</a></li>
            <li><a className="transition-colors hover:text-[#f0c5a8]" href="#container-house">Container House</a></li>
            <li><a className="transition-colors hover:text-[#f0c5a8]" href="#cloud-rest-garden-villa">Cloud Rest Garden Villa</a></li>
          </ul>
        </nav>

        <section id="contact" aria-labelledby="footer-help-heading">
          <h2 id="footer-help-heading" className="text-lg font-semibold text-[#f0c5a8]">Need Help?</h2>
          <address className="mt-4 space-y-3 text-sm not-italic text-white/80">
            <p><a className="transition-colors hover:text-[#f0c5a8]" href="tel:+917094151382">Call: +91 70941 51382</a></p>
            <p><a className="transition-colors hover:text-[#f0c5a8]" href="https://wa.me/917094151382">WhatsApp: +91 70941 51382</a></p>
            <p>Email: <a className="transition-colors hover:text-[#f0c5a8]" href="mailto:cliffstays@gmail.com">cliffstays@gmail.com</a></p>
            <p>Support: 8:00 AM – 9:00 PM IST</p>
            <p>Kodaikanal, Tamil Nadu 624101</p>
          </address>
        </section>

        <nav aria-labelledby="footer-policies-heading">
          <h2 id="footer-policies-heading" className="text-lg font-semibold text-[#f0c5a8]">Policies</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li><a className="transition-colors hover:text-[#f0c5a8]" href="/policies/terms">Terms &amp; Conditions</a></li>
            <li><a className="transition-colors hover:text-[#f0c5a8]" href="/policies/refund">Cancellation &amp; Refund Policy</a></li>
            <li><a className="transition-colors hover:text-[#f0c5a8]" href="/policies/privacy">Privacy Policy</a></li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-[#9a7855]/30">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-2 px-5 py-5 text-xs text-white/80 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Cliff Stays. All rights reserved.</p>
          <p className="text-[#f0c5a8]">Secured by Razorpay</p>
        </div>
      </div>
    </footer>
    </>
  );
}