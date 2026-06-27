<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::where('in_stock', true);

        // Filter by type: ?type=gym or ?type=court
        if ($request->type === 'gym') {
            $query->where('for_gym', true);
        } elseif ($request->type === 'court') {
            $query->where('for_court', true);
        }

        // Filter by category: ?category=Supplements
        if ($request->category) {
            $query->where('category', $request->category);
        }

        return response()->json($query->get());
    }

    public function show(int $id): JsonResponse
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }
}
