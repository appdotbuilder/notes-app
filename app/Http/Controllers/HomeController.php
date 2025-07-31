<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Note;
use App\Models\Folder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the main notes interface.
     */
    public function index(Request $request)
    {
        if (!auth()->check()) {
            return Inertia::render('welcome');
        }

        $query = auth()->user()->notes()->where('is_deleted', false)->with('folder');

        if ($request->has('search') && $request->search) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('title', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('content', 'LIKE', "%{$searchTerm}%");
            });
        }

        if ($request->has('folder') && $request->folder) {
            $query->where('folder_id', $request->folder);
        }

        $notes = $query->orderByDesc('is_pinned')
            ->orderByDesc('updated_at')
            ->limit(50)
            ->get();

        $folders = auth()->user()->folders()
            ->withCount('notes')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        $recentNotes = auth()->user()->notes()->where('is_deleted', false)
            ->orderByDesc('updated_at')
            ->limit(5)
            ->get();

        return Inertia::render('home', [
            'notes' => $notes,
            'folders' => $folders,
            'recentNotes' => $recentNotes,
            'filters' => $request->only(['search', 'folder']),
            'stats' => [
                'totalNotes' => auth()->user()->notes()->where('is_deleted', false)->count(),
                'totalFolders' => auth()->user()->folders()->count(),
                'pinnedNotes' => auth()->user()->notes()->where('is_deleted', false)->where('is_pinned', true)->count(),
            ]
        ]);
    }
}