<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // ── GET /api/notifications ────────────────────────────────────────────────
    public function index()
    {
        $notifications = Notification::where('user_id', auth()->id())
                                     ->orderBy('created_at', 'desc')
                                     ->get();

        return response()->json($notifications);
    }

    // ── PUT /api/notifications/{id}/read ─────────────────────────────────────
    public function markRead($id)
    {
        $notif = Notification::where('id', $id)
                             ->where('user_id', auth()->id())
                             ->firstOrFail();

        $notif->update(['read' => true]);

        return response()->json(['message' => 'Notification marked as read.']);
    }

    // ── PUT /api/notifications/read-all ──────────────────────────────────────
    public function markAllRead()
    {
        Notification::where('user_id', auth()->id())
                    ->where('read', false)
                    ->update(['read' => true]);

        return response()->json(['message' => 'All notifications marked as read.']);
    }
}

