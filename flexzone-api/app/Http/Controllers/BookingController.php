<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class BookingController extends Controller
{
    // ── Get my bookings ───────────────────────────────────────────────────────
    public function index(): JsonResponse
    {
        $bookings = Booking::where('user_id', JWTAuth::user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($bookings);
    }

    // ── Create booking ────────────────────────────────────────────────────────
    public function store(Request $request): JsonResponse
    {
        $v = Validator::make($request->all(), [
            'court_id'       => 'required|string',
            'court_name'     => 'required|string',
            'date'           => 'required|date',
            'time_slots'     => 'required|array|min:1',
            'duration'       => 'required|numeric',
            'category'       => 'required|string',
            'total_amount'   => 'required|numeric',
            'payment_method' => 'nullable|in:gcash,maya,credit_card,cash',
            'notes'          => 'nullable|string',
            'guest_count'    => 'nullable|integer',
            'event_type'     => 'nullable|string',
        ]);

        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        // ── Check slot conflicts ──────────────────────────────────────────────
        $conflicting = Booking::where('court_id', $request->court_id)
            ->where('date', $request->date)
            ->whereNotIn('status', ['cancelled'])
            ->get()
            ->filter(function ($b) use ($request) {
                return count(array_intersect($b->time_slots, $request->time_slots)) > 0;
            });

        if ($conflicting->count() > 0) {
            return response()->json([
                'message' => 'One or more selected time slots are already booked.',
            ], 409);
        }

        $booking = Booking::create([
            'user_id'        => JWTAuth::user()->id,
            'court_id'       => $request->court_id,
            'court_name'     => $request->court_name,
            'date'           => $request->date,
            'time_slots'     => $request->time_slots,
            'duration'       => $request->duration,
            'category'       => $request->category,
            'total_amount'   => $request->total_amount,
            'status'         => 'confirmed',
            'payment_status' => 'unpaid',
            'payment_method' => $request->payment_method,
            'notes'          => $request->notes,
            'guest_count'    => $request->guest_count,
            'event_type'     => $request->event_type,
        ]);

        return response()->json($booking, 201);
    }

    // ── Get booked slots for a court + date ───────────────────────────────────
    public function slots(Request $request): JsonResponse
    {
        $v = Validator::make($request->all(), [
            'court_id' => 'required|string',
            'date'     => 'required|date',
        ]);

        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        $bookedSlots = Booking::where('court_id', $request->court_id)
            ->where('date', $request->date)
            ->whereNotIn('status', ['cancelled'])
            ->pluck('time_slots')
            ->flatten()
            ->unique()
            ->values();

        return response()->json(['booked_slots' => $bookedSlots]);
    }

    // ── Cancel booking ────────────────────────────────────────────────────────
    public function cancel(int $id): JsonResponse
    {
        $booking = Booking::where('id', $id)
            ->where('user_id', JWTAuth::user()->id)
            ->first();

        if (!$booking) {
            return response()->json(['message' => 'Booking not found.'], 404);
        }

        if ($booking->status === 'cancelled') {
            return response()->json(['message' => 'Booking is already cancelled.'], 400);
        }

        $booking->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Booking cancelled.', 'booking' => $booking]);
    }
}
