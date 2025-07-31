<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNoteRequest;
use App\Http\Requests\UpdateNoteRequest;
use App\Models\Note;
use App\Models\Folder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
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
            ->paginate(20);

        $folders = auth()->user()->folders()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('notes/index', [
            'notes' => $notes,
            'folders' => $folders,
            'filters' => $request->only(['search', 'folder'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $folders = auth()->user()->folders()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('notes/create', [
            'folders' => $folders,
            'selectedFolder' => $request->folder_id
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNoteRequest $request)
    {
        $note = Note::create([
            ...$request->validated(),
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('notes.show', $note)
            ->with('success', 'Note created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Note $note)
    {
        if ($note->user_id !== auth()->id()) {
            abort(403);
        }

        $note->load(['folder', 'attachments']);

        $folders = auth()->user()->folders()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('notes/show', [
            'note' => $note,
            'folders' => $folders
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Note $note)
    {
        if ($note->user_id !== auth()->id()) {
            abort(403);
        }

        $note->load(['folder', 'attachments']);

        $folders = auth()->user()->folders()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('notes/edit', [
            'note' => $note,
            'folders' => $folders
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNoteRequest $request, Note $note)
    {
        if ($note->user_id !== auth()->id()) {
            abort(403);
        }

        $note->update($request->validated());

        return Inertia::render('notes/show', [
            'note' => $note->load(['folder', 'attachments']),
            'folders' => auth()->user()->folders()->orderBy('name')->get()
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Note $note)
    {
        if ($note->user_id !== auth()->id()) {
            abort(403);
        }

        $note->update([
            'is_deleted' => true,
            'deleted_at' => now(),
        ]);

        return redirect()->route('notes.index')
            ->with('success', 'Note moved to trash.');
    }
}