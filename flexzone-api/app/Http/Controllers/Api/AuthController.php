<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    // ── Register ──────────────────────────────────────────────────────────────
    public function register(Request $request): JsonResponse
    {
        $v = Validator::make($request->all(), [
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|email|unique:users',
            'password'              => 'required|string|min:6|confirmed',
            'phone'                 => 'nullable|string|max:20',
        ]);

        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        $user = User::create([
            'name'       => $request->name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'phone'      => $request->phone,
            'membership' => 'basic',
            'points'     => 0,
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'Registration successful.',
            'user'    => $user,
            'token'   => $token,
        ], 201);
    }

    // ── Login ─────────────────────────────────────────────────────────────────
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid email or password.'], 401);
        }

        $user = JWTAuth::user();

        return response()->json([
            'message' => 'Login successful.',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    // ── Me ────────────────────────────────────────────────────────────────────
    public function me(): JsonResponse
    {
        return response()->json(JWTAuth::user());
    }

    // ── Update Profile ────────────────────────────────────────────────────────
    public function updateProfile(Request $request): JsonResponse
    {
        $user = JWTAuth::user();

        $v = Validator::make($request->all(), [
            'name'  => 'sometimes|string|max:255',
            'phone' => 'sometimes|nullable|string|max:20',
        ]);

        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        $user->update($request->only('name', 'phone', 'avatar'));

        return response()->json(['message' => 'Profile updated.', 'user' => $user]);
    }

    // ── Logout ────────────────────────────────────────────────────────────────
    public function logout(): JsonResponse
    {
        JWTAuth::invalidate(JWTAuth::getToken());
        return response()->json(['message' => 'Logged out successfully.']);
    }

    // ── Refresh Token ─────────────────────────────────────────────────────────
    public function refresh(): JsonResponse
    {
        $token = JWTAuth::refresh(JWTAuth::getToken());
        return response()->json(['token' => $token]);
    }
}
