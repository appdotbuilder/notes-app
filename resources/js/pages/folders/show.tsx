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
    updated_at: string;
    [key: string]: unknown;
}

interface Folder {
    id: number;
    name: string;
    color: string;
    [key: string]: unknown;
}

interface Props {
    folder: Folder;
    notes: Note[];
    [key: string]: unknown;
}

export default function ShowFolder({ folder, notes }: Props) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredNotes = notes.filter(note => {
        if (!searchQuery) return true;
        const title = note.title || '';
        const content = note.content || '';
        return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               content.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const createNewNote = () => {
        router.get(route('notes.create'), { folder_id: folder.id });
    };

    const editFolder = () => {
        router.get(route('folders.edit', folder.id));
    };

    const deleteFolder = () => {
        if (confirm('Are you sure you want to delete this folder? Notes will not be deleted.')) {
            router.delete(route('folders.destroy', folder.id));
        }
    };

    const getPreviewText = (content: string) => {
        const plainText = content.replace(/<[^>]*>/g, '');
        return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;
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
            <Head title={`${folder.name} - Folder`} />
            
            <div className="min-h-screen bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                            <Button
                                onClick={() => router.get('/')}
                                variant="ghost"
                                size="sm"
                            >
                                ← Back to Notes
                            </Button>
                            
                            <div className="flex items-center space-x-3">
                                <div 
                                    className="w-6 h-6 rounded-lg"
                                    style={{ backgroundColor: folder.color }}
                                />
                                <div>
                                    <h1 className="text-3xl font-bold">{folder.name}</h1>
                                    <p className="text-gray-400">
                                        {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <Button
                                onClick={editFolder}
                                variant="ghost"
                                size="sm"
                            >
                                ✏️ Edit Folder
                            </Button>
                            <Button
                                onClick={deleteFolder}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300"
                            >
                                🗑️ Delete
                            </Button>
                            <Button
                                onClick={createNewNote}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                ✏️ New Note
                            </Button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
                        <Input
                            type="text"
                            placeholder="🔍 Search notes in this folder..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        />
                    </div>

                    {/* Notes Grid */}
                    {filteredNotes.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">📝</div>
                            <h3 className="text-xl font-medium mb-2">
                                {searchQuery ? 'No matching notes' : 'No notes in this folder'}
                            </h3>
                            <p className="text-gray-400 mb-6">
                                {searchQuery 
                                    ? 'Try adjusting your search criteria.'
                                    : 'Start by creating your first note in this folder.'
                                }
                            </p>
                            <Button 
                                onClick={createNewNote}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                ✏️ Create Note
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredNotes.map((note) => (
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
                                            <div 
                                                className="w-3 h-3 rounded"
                                                style={{ backgroundColor: folder.color }}
                                            />
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-4">
                                        {getPreviewText(note.content)}
                                    </p>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">
                                            {formatDate(note.updated_at)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}