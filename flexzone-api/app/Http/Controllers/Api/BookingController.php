<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    // ── GET /api/bookings ─────────────────────────────────────────────────────
    public function index()
    {
        $bookings = Booking::where('user_id', auth()->id())
                           ->orderBy('created_at', 'desc')
                           ->get();

        return response()->json($bookings);
    }

    // ── POST /api/bookings ────────────────────────────────────────────────────
    public function store(Request $request)
    {
        $data = $request->validate([
            'court_id'   => 'required|exists:courts,id',
            'date'       => 'required|date',
            'time_slots' => 'required|array|min:1',
            'total'      => 'required|numeric|min:0',
            'notes'      => 'nullable|string',
        ]);

        $booking = Booking::create([
            'user_id'    => auth()->id(),
            'court_id'   => $data['court_id'],
            'date'       => $data['date'],
            'time_slots' => json_encode($data['time_slots']),
            'total'      => $data['total'],
            'notes'      => $data['notes'] ?? null,
            'status'     => 'confirmed',
        ]);

        return response()->json($booking, 201);
    }

    // ── GET /api/bookings/slots ───────────────────────────────────────────────
    public function slots(Request $request)
    {
        $request->validate([
            'court_id' => 'required|exists:courts,id',
            'date'     => 'required|date',
        ]);

        $takenSlots = Booking::where('court_id', $request->court_id)
                             ->where('date', $request->date)
                             ->whereIn('status', ['confirmed', 'pending'])
                             ->pluck('time_slots')
                             ->flatMap(fn($s) => json_decode($s, true))
                             ->unique()
                             ->values();

        return response()->json(['taken_slots' => $takenSlots]);
    }

    // ── PUT /api/bookings/{id}/cancel ─────────────────────────────────────────
    public function cancel($id)
    {
        $booking = Booking::where('id', $id)
                          ->where('user_id', auth()->id())
                          ->firstOrFail();

        $booking->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Booking cancelled successfully.']);
    }

    // ── POST /api/bookings/{id}/refund  ← NEW ────────────────────────────────
    public function refund(Request $request, $id)
    {
        $booking = Booking::where('id', $id)
                          ->where('user_id', auth()->id())
                          ->firstOrFail();

        // Only confirmed bookings can be refunded
        if ($booking->status !== 'confirmed') {
            return response()->json([
                'message' => 'Only confirmed bookings can be refunded.',
            ], 422);
        }

        // Calculate refund percentage based on days until booking
        $daysUntil  = now()->diffInDays($booking->date, false);
        $refundPct  = $daysUntil >= 7 ? 100 : ($daysUntil >= 3 ? 50 : 0);
        $refundAmt  = round($booking->total * $refundPct / 100, 2);

        $request->validate([
            'reason'  => 'required|string|max:255',
            'details' => 'nullable|string|max:1000',
        ]);

        // Mark booking as cancelled
        $booking->update(['status' => 'cancelled']);

        // TODO: trigger PayMongo refund here when payment integration is live
        // PayMongoService::refund($booking->payment_id, $refundAmt);

        return response()->json([
            'message'       => 'Refund request submitted successfully.',
            'refund_pct'    => $refundPct,
            'refund_amount' => $refundAmt,
            'reference'     => 'REF-' . strtoupper(base_convert(time(), 10, 36)),
        ]);
    }
}
