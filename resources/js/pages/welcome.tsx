import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome to NotePad" />
            
            <div className="min-h-screen bg-gray-900 text-white">
                {/* Navigation */}
                <nav className="flex items-center justify-between p-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">📝</span>
                        </div>
                        <span className="text-xl font-semibold">NotePad</span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <Link href="/login">
                            <Button variant="ghost" className="text-gray-300 hover:text-white">
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="container mx-auto px-6 py-16">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold mb-6">
                            📝 Your Digital Notebook
                            <br />
                            <span className="text-blue-400">Reimagined</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Create, organize, and find your notes instantly. Rich text formatting, 
                            image attachments, and powerful search - all in a beautiful, dark interface.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link href="/register">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
                                    Start Writing Now
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 text-lg">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-2xl">✏️</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Rich Text Editor</h3>
                            <p className="text-gray-400">Format your notes with bold, italics, lists, and more. Express your ideas exactly how you want.</p>
                        </div>

                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-2xl">📁</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Smart Organization</h3>
                            <p className="text-gray-400">Organize notes into colorful folders. Pin important notes and keep everything tidy.</p>
                        </div>

                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-2xl">🔍</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Powerful Search</h3>
                            <p className="text-gray-400">Find any note instantly with full-text search. Never lose track of your thoughts again.</p>
                        </div>

                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-2xl">📷</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Image Attachments</h3>
                            <p className="text-gray-400">Attach images to your notes. Perfect for visual learners and creative projects.</p>
                        </div>

                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-2xl">📌</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Pin Important Notes</h3>
                            <p className="text-gray-400">Keep your most important notes at the top. Quick access to what matters most.</p>
                        </div>

                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-2xl">🌙</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Dark Theme</h3>
                            <p className="text-gray-400">Easy on the eyes with a beautiful dark interface. Perfect for late-night writing sessions.</p>
                        </div>
                    </div>

                    {/* App Preview */}
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-8">See It In Action</h2>
                        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 max-w-4xl mx-auto">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                </div>
                                <div className="text-sm text-gray-400">NotePad App</div>
                            </div>
                            
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-gray-700 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium">📁 Folders</h4>
                                        <span className="text-xs text-gray-400">3</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                            <span className="text-sm">Work Notes</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                                            <span className="text-sm">Personal</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 bg-purple-500 rounded"></div>
                                            <span className="text-sm">Ideas</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-700 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium">📝 Recent Notes</h4>
                                        <span className="text-xs text-gray-400">8</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-sm">📌 Meeting Notes</div>
                                        <div className="text-sm">Project Ideas</div>
                                        <div className="text-sm">Weekend Plans</div>
                                        <div className="text-sm text-gray-400">+ 5 more</div>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-700 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium">✨ Editor Preview</h4>
                                    </div>
                                    <div className="text-sm space-y-2">
                                        <div className="font-bold">Meeting Notes</div>
                                        <div className="text-gray-300">
                                            <strong>Agenda:</strong>
                                            <br />• Review Q4 goals
                                            <br />• Budget planning
                                            <br />• Team updates
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="text-center bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-12 border border-blue-500/20">
                        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Note-Taking?</h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Join thousands of users who've already upgraded their digital notebook experience.
                        </p>
                        <Link href="/register">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-12 py-4 text-lg">
                                Create Your Account - It's Free! 🚀
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <footer className="border-t border-gray-800 py-8">
                    <div className="container mx-auto px-6 text-center text-gray-400">
                        <p>&copy; 2024 NotePad. Your thoughts, beautifully organized.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}