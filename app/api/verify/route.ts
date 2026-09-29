import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
console.log('Supabase URL loaded:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Service Role Key loaded:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
const supabase = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

export async function POST(request: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      guestName,
      guestPhone,
      propertyId,
      checkIn,
      checkOut,
    } = await request.json();

    if (
      typeof razorpay_order_id !== 'string' ||
      typeof razorpay_payment_id !== 'string' ||
      typeof razorpay_signature !== 'string' ||
      typeof guestName !== 'string' ||
      !guestName.trim() ||
      typeof guestPhone !== 'string' ||
      !guestPhone.trim() ||
      typeof propertyId !== 'string' ||
      typeof checkIn !== 'string' ||
      typeof checkOut !== 'string'
    ) {
      return NextResponse.json({ success: false, error: 'Invalid verification details' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      throw new Error('Razorpay secret is not configured');
    }

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    const expectedBuffer = Buffer.from(generatedSignature, 'hex');
    const receivedBuffer = Buffer.from(razorpay_signature, 'hex');

    const signaturesMatch =
      receivedBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!signaturesMatch) {
      return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 });
    }

    try {
      if (!supabase) {
        throw new Error('Supabase is not configured');
      }

      const { error: dbError } = await supabase.from('bookings').insert({
        guest_name: guestName,
        guest_phone: guestPhone,
        property_id: propertyId,
        check_in: checkIn,
        check_out: checkOut,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_order_id: razorpay_order_id,
      });

      if (dbError) {
        console.error('Supabase Insert Error:', dbError);
        return NextResponse.json({ error: 'Failed to save booking record' }, { status: 500 });
      }
    } catch (databaseError) {
      console.error('Failed to save booking to Supabase:', databaseError);
      return NextResponse.json(
        { success: false, error: 'Payment was verified, but the booking could not be saved. Please contact support.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, message: 'Verified' });
  } catch (error) {
    console.error('Razorpay verification error:', error);
    return NextResponse.json({ success: false, error: 'Failed to verify payment' }, { status: 500 });
  }
}