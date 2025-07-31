<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFolderRequest;
use App\Http\Requests\UpdateFolderRequest;
use App\Models\Folder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FolderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $folders = auth()->user()->folders()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('folders/index', [
            'folders' => $folders
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('folders/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFolderRequest $request)
    {
        $folder = Folder::create([
            ...$request->validated(),
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('folders.show', $folder)
            ->with('success', 'Folder created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Folder $folder)
    {
        if ($folder->user_id !== auth()->id()) {
            abort(403);
        }

        $notes = $folder->notes()->where('is_deleted', false)
            ->orderByDesc('is_pinned')
            ->orderByDesc('updated_at')
            ->get();

        return Inertia::render('folders/show', [
            'folder' => $folder,
            'notes' => $notes
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Folder $folder)
    {
        if ($folder->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('folders/edit', [
            'folder' => $folder
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFolderRequest $request, Folder $folder)
    {
        if ($folder->user_id !== auth()->id()) {
            abort(403);
        }

        $folder->update($request->validated());

        return redirect()->route('folders.show', $folder)
            ->with('success', 'Folder updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Folder $folder)
    {
        if ($folder->user_id !== auth()->id()) {
            abort(403);
        }

        $folder->delete();

        return redirect()->route('notes.index')
            ->with('success', 'Folder deleted successfully.');
    }
}