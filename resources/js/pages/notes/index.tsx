import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Note {
    id: number;
    title: string | null;
    content: string;
    is_pinned: boolean;
    folder?: {
        id: number;
        name: string;
        color: string;
    };
    updated_at: string;
    [key: string]: unknown;
}

interface Folder {
    id: number;
    name: string;
    color: string;
    [key: string]: unknown;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    notes: {
        data: Note[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    folders: Folder[];
    filters: {
        search?: string;
        folder?: string;
    };
    [key: string]: unknown;
}

export default function NotesIndex({ notes, folders, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedFolder, setSelectedFolder] = useState(filters.folder || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('notes.index'), { search: searchQuery, folder: selectedFolder }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const createNewNote = () => {
        router.get(route('notes.create'), { folder_id: selectedFolder || null });
    };

    const getPreviewText = (content: string) => {
        const plainText = content.replace(/<[^>]*>/g, '');
        return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 48) return 'Yesterday';
        return date.toLocaleDateString();
    };

    return (
        <AppShell>
            <Head title="All Notes" />
            
            <div className="min-h-screen bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold">📝 All Notes</h1>
                            <p className="text-gray-400 mt-1">
                                {notes.data.length} {notes.data.length === 1 ? 'note' : 'notes'} found
                                {filters.search && ` for "${filters.search}"`}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button
                                onClick={() => router.get(route('folders.create'))}
                                variant="ghost"
                            >
                                📁 New Folder
                            </Button>
                            <Button
                                onClick={createNewNote}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                ✏️ New Note
                            </Button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    placeholder="🔍 Search notes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                />
                            </div>
                            <div className="w-48">
                                <select
                                    value={selectedFolder}
                                    onChange={(e) => setSelectedFolder(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                                >
                                    <option value="">All folders</option>
                                    {folders.map((folder) => (
                                        <option key={folder.id} value={folder.id}>
                                            {folder.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                Search
                            </Button>
                        </form>
                    </div>

                    {/* Notes Grid */}
                    {notes.data.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">📝</div>
                            <h3 className="text-xl font-medium mb-2">No notes found</h3>
                            <p className="text-gray-400 mb-6">
                                {filters.search || filters.folder 
                                    ? 'Try adjusting your search criteria.'
                                    : 'Start by creating your first note.'
                                }
                            </p>
                            <Button 
                                onClick={createNewNote}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                ✏️ Create Your First Note
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {notes.data.map((note) => (
                                <div
                                    key={note.id}
                                    onClick={() => router.get(route('notes.show', note.id))}
                                    className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 cursor-pointer transition-all hover:shadow-lg"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="font-medium text-white truncate flex-1 text-lg">
                                            {note.title || 'Untitled'}
                                        </h3>
                                        <div className="flex items-center space-x-2 ml-2">
                                            {note.is_pinned && (
                                                <Badge variant="secondary" className="text-xs">
                                                    📌
                                                </Badge>
                                            )}
                                            {note.folder && (
                                                <div 
                                                    className="w-3 h-3 rounded"
                                                    style={{ backgroundColor: note.folder.color }}
                                                    title={note.folder.name}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-4">
                                        {getPreviewText(note.content)}
                                    </p>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">
                                            {formatDate(note.updated_at)}
                                        </span>
                                        {note.folder && (
                                            <Badge variant="outline" className="text-xs">
                                                {note.folder.name}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {notes.meta && notes.meta.last_page > 1 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex items-center space-x-2">
                                {notes.links.map((link, index: number) => (
                                    <Button
                                        key={index}
                                        onClick={() => link.url && router.get(link.url)}
                                        variant={link.active ? "default" : "ghost"}
                                        size="sm"
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}