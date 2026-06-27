<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Court;
use Illuminate\Http\JsonResponse;

class CourtController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Court::where('active', true)->get());
    }
}
