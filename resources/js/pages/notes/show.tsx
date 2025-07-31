import React, { useState, useRef, useEffect } from 'react';
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
    folder_id: number | null;
    folder?: {
        id: number;
        name: string;
        color: string;
    };
    updated_at: string;
    attachments?: Array<{
        id: number;
        filename: string;
        original_filename: string;
        mime_type: string;
        file_size: number;
    }>;
    [key: string]: unknown;
}

interface Folder {
    id: number;
    name: string;
    color: string;
    [key: string]: unknown;
}

interface Props {
    note: Note;
    folders: Folder[];
    [key: string]: unknown;
}

export default function ShowNote({ note, folders }: Props) {
    const [title, setTitle] = useState(note.title || '');
    const [content, setContent] = useState(note.content || '');
    const [selectedFolder, setSelectedFolder] = useState(note.folder_id?.toString() || '');
    const [isPinned, setIsPinned] = useState(note.is_pinned);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const contentRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && titleRef.current) {
            titleRef.current.focus();
        }
    }, [isEditing]);

    const handleSave = async () => {
        setIsSaving(true);
        
        router.put(route('notes.update', note.id), {
            title: title || null,
            content: content,
            folder_id: selectedFolder || null,
            is_pinned: isPinned,
        }, {
            preserveState: true,
            onSuccess: () => {
                setIsEditing(false);
                setIsSaving(false);
            },
            onError: () => {
                setIsSaving(false);
            }
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this note?')) {
            router.delete(route('notes.destroy', note.id));
        }
    };

    const togglePin = () => {
        setIsPinned(!isPinned);
        router.put(route('notes.update', note.id), {
            title: title || null,
            content: content,
            folder_id: selectedFolder || null,
            is_pinned: !isPinned,
        }, {
            preserveState: true,
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const handleBold = () => {
        document.execCommand('bold', false);
    };

    const handleItalic = () => {
        document.execCommand('italic', false);
    };

    const handleUnorderedList = () => {
        document.execCommand('insertUnorderedList', false);
    };

    const handleOrderedList = () => {
        document.execCommand('insertOrderedList', false);
    };

    return (
        <AppShell>
            <Head title={title || 'Untitled Note'} />
            
            <div className="min-h-screen bg-gray-900 text-white">
                <div className="max-w-4xl mx-auto p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <Button
                                onClick={() => router.get('/')}
                                variant="ghost"
                                size="sm"
                            >
                                ← Back to Notes
                            </Button>
                            
                            {note.folder && (
                                <Badge 
                                    variant="outline" 
                                    className="flex items-center space-x-1"
                                    style={{ borderColor: note.folder.color }}
                                >
                                    <div 
                                        className="w-2 h-2 rounded"
                                        style={{ backgroundColor: note.folder.color }}
                                    />
                                    <span>{note.folder.name}</span>
                                </Badge>
                            )}
                            
                            {isPinned && (
                                <Badge variant="secondary">
                                    📌 Pinned
                                </Badge>
                            )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <Button
                                onClick={togglePin}
                                variant="ghost"
                                size="sm"
                                className={isPinned ? 'text-yellow-400' : 'text-gray-400'}
                            >
                                📌
                            </Button>
                            
                            {!isEditing ? (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    ✏️ Edit
                                </Button>
                            ) : (
                                <div className="flex space-x-2">
                                    <Button
                                        onClick={() => setIsEditing(false)}
                                        variant="ghost"
                                        size="sm"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? 'Saving...' : '💾 Save'}
                                    </Button>
                                </div>
                            )}
                            
                            <Button
                                onClick={handleDelete}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300"
                            >
                                🗑️
                            </Button>
                        </div>
                    </div>

                    {/* Note Content */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                        {/* Title */}
                        <div className="p-6 border-b border-gray-700">
                            {isEditing ? (
                                <Input
                                    ref={titleRef}
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Note title..."
                                    className="text-2xl font-bold bg-transparent border-none p-0 text-white placeholder-gray-500"
                                />
                            ) : (
                                <h1 className="text-2xl font-bold text-white">
                                    {title || 'Untitled Note'}
                                </h1>
                            )}
                            <p className="text-sm text-gray-400 mt-2">
                                Last updated: {formatDate(note.updated_at)}
                            </p>
                        </div>

                        {/* Formatting Toolbar (when editing) */}
                        {isEditing && (
                            <div className="p-4 border-b border-gray-700 bg-gray-750">
                                <div className="flex items-center space-x-2">
                                    <Button
                                        onClick={handleBold}
                                        variant="ghost"
                                        size="sm"
                                        className="font-bold"
                                    >
                                        B
                                    </Button>
                                    <Button
                                        onClick={handleItalic}
                                        variant="ghost"
                                        size="sm"
                                        className="italic"
                                    >
                                        I
                                    </Button>
                                    <div className="w-px h-6 bg-gray-600 mx-2" />
                                    <Button
                                        onClick={handleUnorderedList}
                                        variant="ghost"
                                        size="sm"
                                    >
                                        • List
                                    </Button>
                                    <Button
                                        onClick={handleOrderedList}
                                        variant="ghost"
                                        size="sm"
                                    >
                                        1. List
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-6">
                            {isEditing ? (
                                <div
                                    ref={contentRef}
                                    contentEditable
                                    suppressContentEditableWarning
                                    onInput={(e) => setContent(e.currentTarget.innerHTML)}
                                    dangerouslySetInnerHTML={{ __html: content }}
                                    className="min-h-64 text-gray-200 focus:outline-none prose prose-invert max-w-none"
                                    style={{ whiteSpace: 'pre-wrap' }}
                                />
                            ) : (
                                <div 
                                    className="text-gray-200 prose prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: content }}
                                />
                            )}
                        </div>

                        {/* Folder Selection (when editing) */}
                        {isEditing && (
                            <div className="p-6 border-t border-gray-700">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Folder
                                </label>
                                <select
                                    value={selectedFolder}
                                    onChange={(e) => setSelectedFolder(e.target.value)}
                                    className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                                >
                                    <option value="">No folder</option>
                                    {folders.map((folder) => (
                                        <option key={folder.id} value={folder.id}>
                                            {folder.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Attachments */}
                        {note.attachments && note.attachments.length > 0 && (
                            <div className="p-6 border-t border-gray-700">
                                <h3 className="text-sm font-medium text-gray-300 mb-3">
                                    📎 Attachments ({note.attachments.length})
                                </h3>
                                <div className="space-y-2">
                                    {note.attachments.map((attachment) => (
                                        <div 
                                            key={attachment.id}
                                            className="flex items-center justify-between bg-gray-700 rounded-lg p-3"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <span className="text-2xl">
                                                    {attachment.mime_type.startsWith('image/') ? '🖼️' : '📄'}
                                                </span>
                                                <div>
                                                    <div className="text-sm font-medium text-white">
                                                        {attachment.original_filename}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {(attachment.file_size / 1024).toFixed(1)} KB
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-blue-400 hover:text-blue-300"
                                            >
                                                Download
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}