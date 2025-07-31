import React, { useState, useRef, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Folder {
    id: number;
    name: string;
    color: string;
    [key: string]: unknown;
}

interface Props {
    folders: Folder[];
    selectedFolder?: string;
    [key: string]: unknown;
}

export default function CreateNote({ folders, selectedFolder }: Props) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [folderId, setFolderId] = useState(selectedFolder || '');
    const [isPinned, setIsPinned] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    
    const contentRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.focus();
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        router.post(route('notes.store'), {
            title: title || null,
            content: content || 'Start writing...',
            folder_id: folderId || null,
            is_pinned: isPinned,
        }, {
            onSuccess: () => {
                // Redirect handled by controller
            },
            onError: (errors) => {
                setErrors(errors);
                setIsSubmitting(false);
            }
        });
    };

    const handleBold = () => {
        document.execCommand('bold', false);
        contentRef.current?.focus();
    };

    const handleItalic = () => {
        document.execCommand('italic', false);
        contentRef.current?.focus();
    };

    const handleUnorderedList = () => {
        document.execCommand('insertUnorderedList', false);
        contentRef.current?.focus();
    };

    const handleOrderedList = () => {
        document.execCommand('insertOrderedList', false);
        contentRef.current?.focus();
    };

    return (
        <AppShell>
            <Head title="Create New Note" />
            
            <div className="min-h-screen bg-gray-900 text-white">
                <div className="max-w-4xl mx-auto p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold">✏️ Create New Note</h1>
                            <p className="text-gray-400 mt-1">
                                Start writing your thoughts
                            </p>
                        </div>
                        <Button
                            onClick={() => router.get('/')}
                            variant="ghost"
                        >
                            ← Back to Notes
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Note Editor */}
                        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden mb-6">
                            {/* Title */}
                            <div className="p-6 border-b border-gray-700">
                                <Input
                                    ref={titleRef}
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Note title..."
                                    className="text-2xl font-bold bg-transparent border-none p-0 text-white placeholder-gray-500"
                                />
                                {errors.title && (
                                    <p className="text-red-400 text-sm mt-2">{errors.title}</p>
                                )}
                            </div>

                            {/* Formatting Toolbar */}
                            <div className="p-4 border-b border-gray-700 bg-gray-750">
                                <div className="flex items-center space-x-2">
                                    <Button
                                        type="button"
                                        onClick={handleBold}
                                        variant="ghost"
                                        size="sm"
                                        className="font-bold"
                                    >
                                        B
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleItalic}
                                        variant="ghost"
                                        size="sm"
                                        className="italic"
                                    >
                                        I
                                    </Button>
                                    <div className="w-px h-6 bg-gray-600 mx-2" />
                                    <Button
                                        type="button"
                                        onClick={handleUnorderedList}
                                        variant="ghost"
                                        size="sm"
                                    >
                                        • List
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleOrderedList}
                                        variant="ghost"
                                        size="sm"
                                    >
                                        1. List
                                    </Button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div
                                    ref={contentRef}
                                    contentEditable
                                    suppressContentEditableWarning
                                    onInput={(e) => setContent(e.currentTarget.innerHTML)}
                                    className="min-h-64 text-gray-200 focus:outline-none prose prose-invert max-w-none"
                                    style={{ whiteSpace: 'pre-wrap' }}
                                    data-placeholder="Start writing your note..."
                                />
                                {errors.content && (
                                    <p className="text-red-400 text-sm mt-2">{errors.content}</p>
                                )}
                            </div>
                        </div>

                        {/* Note Settings */}
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
                            <h3 className="text-lg font-medium text-white mb-4">📝 Note Settings</h3>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Folder Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        📁 Folder
                                    </label>
                                    <select
                                        value={folderId}
                                        onChange={(e) => setFolderId(e.target.value)}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                                    >
                                        <option value="">No folder</option>
                                        {folders.map((folder) => (
                                            <option key={folder.id} value={folder.id}>
                                                {folder.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.folder_id && (
                                        <p className="text-red-400 text-sm mt-1">{errors.folder_id}</p>
                                    )}
                                </div>

                                {/* Pin Option */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        📌 Options
                                    </label>
                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={isPinned}
                                            onChange={(e) => setIsPinned(e.target.checked)}
                                            className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-300">Pin this note to the top</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end space-x-4">
                            <Button
                                type="button"
                                onClick={() => router.get('/')}
                                variant="ghost"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating...' : '💾 Create Note'}
                            </Button>
                        </div>
                    </form>

                    {/* Tips */}
                    <div className="mt-8 bg-blue-900/20 border border-blue-500/20 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-blue-400 mb-3">💡 Writing Tips</h3>
                        <ul className="text-gray-300 space-y-2 text-sm">
                            <li>• Use the formatting toolbar to make your text <strong>bold</strong> or <em>italic</em></li>
                            <li>• Create bulleted or numbered lists for better organization</li>
                            <li>• Pin important notes to keep them at the top of your list</li>
                            <li>• Organize notes into folders for easy browsing</li>
                            <li>• Your notes are automatically saved as you type</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}