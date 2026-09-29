import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
  try {
    const { propertyId, roomCount, checkIn, checkOut } = await request.json();

    if (!Number.isInteger(roomCount) || roomCount < 1) {
      return NextResponse.json({ error: 'Select a valid number of rooms' }, { status: 400 });
    }

    if (typeof checkIn !== 'string' || typeof checkOut !== 'string' || !checkIn || !checkOut) {
      return NextResponse.json({ error: 'Select check-in and check-out dates' }, { status: 400 });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
      return NextResponse.json({ error: 'Invalid date range' }, { status: 400 });
    }

    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const nights = diffDays;

    let totalAmount = 0;

    if (propertyId === 'palm-stay') {
      if (roomCount > 8) return NextResponse.json({ error: 'Exceeds capacity' }, { status: 400 });
      const rates = [0, 3500, 7000, 10000, 13500, 17000, 20000, 23500, 26500];
      totalAmount = rates[roomCount] * nights;
    } 
    else if (propertyId === 'container-house') {
      if (roomCount > 6) return NextResponse.json({ error: 'Exceeds capacity' }, { status: 400 });
      totalAmount = (roomCount * 2000) * nights;
    } 
    else if (propertyId === 'cloud-rest-garden-villa') {
      if (roomCount > 6) return NextResponse.json({ error: 'Exceeds capacity' }, { status: 400 });
      totalAmount = (roomCount * 2500) * nights;
    } 
    else {
      return NextResponse.json({ error: 'Invalid property selected' }, { status: 400 });
    }

    if (!Number.isSafeInteger(totalAmount) || totalAmount <= 0) {
      return NextResponse.json({ error: 'Unable to calculate booking amount' }, { status: 400 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      console.error('Razorpay credentials are not configured');
      return NextResponse.json({ error: 'Secure checkout is not configured' }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });

    return NextResponse.json({ 
      orderId: order.id, 
      amount: order.amount, 
      currency: order.currency 
    });

  } catch (error) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: 'Failed to process secure checkout' }, { status: 500 });
  }
}