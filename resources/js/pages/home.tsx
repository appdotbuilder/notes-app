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
    notes_count: number;
    [key: string]: unknown;
}

interface Props {
    notes: Note[];
    folders: Folder[];
    recentNotes: Note[];
    filters: {
        search?: string;
        folder?: string;
    };
    stats: {
        totalNotes: number;
        totalFolders: number;
        pinnedNotes: number;
    };
    [key: string]: unknown;
}

export default function Home({ notes, folders, filters, stats }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedFolder, setSelectedFolder] = useState(filters.folder || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/', { search: searchQuery, folder: selectedFolder }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const createNewNote = () => {
        router.post(route('notes.store'), {
            title: '',
            content: '',
            folder_id: selectedFolder || null
        });
    };

    const createNewFolder = () => {
        router.get(route('folders.create'));
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
            <Head title="My Notes" />
            
            <div className="min-h-screen bg-gray-900 text-white">
                <div className="flex h-screen">
                    {/* Sidebar */}
                    <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-2xl font-bold flex items-center">
                                    📝 <span className="ml-2">NotePad</span>
                                </h1>
                                <Button 
                                    onClick={createNewNote}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    ✏️ New Note
                                </Button>
                            </div>
                            
                            {/* Search */}
                            <form onSubmit={handleSearch} className="space-y-3">
                                <Input
                                    type="text"
                                    placeholder="🔍 Search notes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                />
                            </form>
                        </div>

                        {/* Stats */}
                        <div className="px-6 py-4 border-b border-gray-700">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-blue-400">{stats.totalNotes}</div>
                                    <div className="text-xs text-gray-400">Notes</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-400">{stats.totalFolders}</div>
                                    <div className="text-xs text-gray-400">Folders</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-yellow-400">{stats.pinnedNotes}</div>
                                    <div className="text-xs text-gray-400">Pinned</div>
                                </div>
                            </div>
                        </div>

                        {/* Folders */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-medium text-gray-300">📁 Folders</h3>
                                    <Button 
                                        onClick={createNewFolder}
                                        size="sm"
                                        variant="ghost"
                                        className="text-xs"
                                    >
                                        + Add
                                    </Button>
                                </div>
                                
                                <div className="space-y-1">
                                    <button
                                        onClick={() => {
                                            setSelectedFolder('');
                                            router.get('/', { search: searchQuery }, { preserveState: true });
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                            !selectedFolder 
                                                ? 'bg-gray-700 text-white' 
                                                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                        }`}
                                    >
                                        📋 All Notes ({stats.totalNotes})
                                    </button>
                                    
                                    {folders.map((folder) => (
                                        <button
                                            key={folder.id}
                                            onClick={() => {
                                                setSelectedFolder(folder.id.toString());
                                                router.get('/', { 
                                                    search: searchQuery, 
                                                    folder: folder.id 
                                                }, { preserveState: true });
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                                                selectedFolder === folder.id.toString()
                                                    ? 'bg-gray-700 text-white'
                                                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                            }`}
                                        >
                                            <div className="flex items-center">
                                                <div 
                                                    className="w-3 h-3 rounded mr-2"
                                                    style={{ backgroundColor: folder.color }}
                                                />
                                                {folder.name}
                                            </div>
                                            <span className="text-xs">({folder.notes_count})</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col">
                        {/* Content Header */}
                        <div className="p-6 border-b border-gray-700 bg-gray-900">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {selectedFolder 
                                            ? `📁 ${folders.find(f => f.id.toString() === selectedFolder)?.name}`
                                            : searchQuery 
                                                ? `🔍 Search results for "${searchQuery}"`
                                                : '📋 All Notes'
                                        }
                                    </h2>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                                    </p>
                                </div>
                                <Button 
                                    onClick={createNewNote}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    ✏️ New Note
                                </Button>
                            </div>
                        </div>

                        {/* Notes Grid */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {notes.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="text-6xl mb-4">📝</div>
                                    <h3 className="text-xl font-medium mb-2">No notes yet</h3>
                                    <p className="text-gray-400 mb-6">
                                        {searchQuery 
                                            ? 'No notes match your search criteria.'
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
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {notes.map((note) => (
                                        <div
                                            key={note.id}
                                            onClick={() => router.get(route('notes.show', note.id))}
                                            className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 cursor-pointer transition-all hover:shadow-lg"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-medium text-white truncate flex-1">
                                                    {note.title || 'Untitled'}
                                                </h3>
                                                <div className="flex items-center space-x-1 ml-2">
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
                                            
                                            <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                                                {getPreviewText(note.content)}
                                            </p>
                                            
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(note.updated_at)}
                                                </span>
                                                {note.folder && (
                                                    <span className="text-xs text-gray-500">
                                                        {note.folder.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}