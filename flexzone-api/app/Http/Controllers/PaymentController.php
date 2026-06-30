<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * GET /api/payments
     * List the authenticated user's payments (optionally filter by user_id query param,
     * same pattern as your TransactionController).
     */
    public function index(Request $request)
    {
        $userId = $request->query('user_id', Auth::id());

        $payments = Payment::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $payments]);
    }

    /**
     * POST /api/payments
     * Save a payment record to MySQL — no external payment gateway call.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount'      => 'required|numeric|min:0',
            'method'      => 'required|string|in:gcash,maya,credit_card,cash',
            'status'      => 'sometimes|string|in:pending,paid,unpaid,refunded,failed,success',
            'reference'   => 'sometimes|nullable|string',
            'description' => 'sometimes|nullable|string',
            'booking_id'  => 'sometimes|nullable|integer|exists:bookings,id',
            'items'       => 'sometimes|nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $payment = Payment::create([
            'user_id'     => Auth::id(),
            'booking_id'  => $request->input('booking_id'),
            'amount'      => $request->input('amount'),
            'method'      => $request->input('method'),
            'status'      => $request->input('status', 'paid'),
            'reference'   => $request->input('reference', 'PAY-' . strtoupper(Str::random(8))),
            'description' => $request->input('description'),
            'items'       => $request->input('items'),
        ]);

        return response()->json([
            'message' => 'Payment recorded successfully',
            'data'    => $payment,
        ], 201);
    }

    /**
     * GET /api/payments/{id}
     */
    public function show($id)
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        return response()->json(['data' => $payment]);
    }
}
