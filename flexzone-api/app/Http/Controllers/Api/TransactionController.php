<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class TransactionController extends Controller
{
    public function index(): JsonResponse
    {
        $transactions = Transaction::where('user_id', JWTAuth::user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($transactions);
    }

    public function store(Request $request): JsonResponse
    {
        $v = Validator::make($request->all(), [
            'amount'      => 'required|numeric',
            'method'      => 'required|in:gcash,maya,credit_card,cash',
            'status'      => 'required|in:pending,success,failed,refunded',
            'description' => 'required|string',
            'booking_id'  => 'nullable|exists:bookings,id',
            'items'       => 'nullable|array',
        ]);

        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        $transaction = Transaction::create([
            'user_id'     => JWTAuth::user()->id,
            'amount'      => $request->amount,
            'method'      => $request->method,
            'status'      => $request->status,
            'reference'   => 'FZ-' . strtoupper(Str::random(8)),
            'description' => $request->description,
            'booking_id'  => $request->booking_id,
            'items'       => $request->items ?? [],
        ]);

        return response()->json($transaction, 201);
    }
}
