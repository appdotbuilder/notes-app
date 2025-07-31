import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';



const FOLDER_COLORS = [
    '#007AFF', // Blue
    '#34C759', // Green
    '#FF9500', // Orange
    '#FF3B30', // Red
    '#AF52DE', // Purple
    '#FF2D92', // Pink
    '#A2845E', // Brown
    '#8E8E93', // Gray
];

export default function CreateFolder() {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#007AFF');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        router.post(route('folders.store'), {
            name,
            color,
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

    return (
        <AppShell>
            <Head title="Create New Folder" />
            
            <div className="min-h-screen bg-gray-900 text-white">
                <div className="max-w-2xl mx-auto p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold">📁 Create New Folder</h1>
                            <p className="text-gray-400 mt-1">
                                Organize your notes with a custom folder
                            </p>
                        </div>
                        <Button
                            onClick={() => router.get('/')}
                            variant="ghost"
                        >
                            ← Back to Notes
                        </Button>
                    </div>

                    {/* Form */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Folder Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Folder Name
                                </label>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter folder name..."
                                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Color Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Folder Color
                                </label>
                                <div className="grid grid-cols-4 gap-3">
                                    {FOLDER_COLORS.map((folderColor) => (
                                        <button
                                            key={folderColor}
                                            type="button"
                                            onClick={() => setColor(folderColor)}
                                            className={`w-16 h-16 rounded-lg border-2 transition-all ${
                                                color === folderColor 
                                                    ? 'border-white shadow-lg scale-105' 
                                                    : 'border-gray-600 hover:border-gray-400'
                                            }`}
                                            style={{ backgroundColor: folderColor }}
                                        >
                                            {color === folderColor && (
                                                <span className="text-white text-xl">✓</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                {errors.color && (
                                    <p className="text-red-400 text-sm mt-1">{errors.color}</p>
                                )}
                            </div>

                            {/* Preview */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Preview
                                </label>
                                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                                    <div className="flex items-center space-x-3">
                                        <div 
                                            className="w-4 h-4 rounded"
                                            style={{ backgroundColor: color }}
                                        />
                                        <span className="text-white font-medium">
                                            {name || 'Folder Name'}
                                        </span>
                                        <span className="text-gray-400 text-sm">(0 notes)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700">
                                <Button
                                    type="button"
                                    onClick={() => router.get('/')}
                                    variant="ghost"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700"
                                    disabled={isSubmitting || !name}
                                >
                                    {isSubmitting ? 'Creating...' : '📁 Create Folder'}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Tips */}
                    <div className="mt-8 bg-blue-900/20 border border-blue-500/20 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-blue-400 mb-3">💡 Tips</h3>
                        <ul className="text-gray-300 space-y-2 text-sm">
                            <li>• Use descriptive names like "Work", "Personal", or "Ideas"</li>
                            <li>• Choose colors that help you quickly identify different categories</li>
                            <li>• You can always edit the folder name and color later</li>
                            <li>• Notes can be moved between folders at any time</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}