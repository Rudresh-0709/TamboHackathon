import { Bell, Settings, MessageSquare, FileText, ChevronRight } from "lucide-react";

interface DashboardProps {
    onNavigate: (view: 'chat' | 'file') => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
    return (
        <div className="min-h-screen bg-background-light font-sans text-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                <div className="bg-primary p-1.5 rounded-lg">
                                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" fill="currentColor"></path>
                                    </svg>
                                </div>
                                <span className="text-lg font-bold tracking-tight">StudBud</span>
                            </div>
                            <nav className="hidden md:flex items-center gap-6">
                                <a href="#" className="text-sm font-semibold text-primary">Dashboard</a>
                                <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">My Assessments</a>
                                <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Team</a>
                                <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Insights</a>
                            </nav>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                                <Settings className="w-5 h-5" />
                            </button>
                            <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs ml-1 cursor-pointer">
                                AL
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Welcome Section */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Hello, Alex! How would you like to build your assessment today?
                    </h1>
                    <p className="text-slate-500 text-lg">
                        Choose your preferred method to get started with AI-generated testing.
                    </p>
                </div>

                {/* Selection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Chat Mode Card */}
                    <div
                        onClick={() => onNavigate('chat')}
                        className="group bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <MessageSquare className="w-32 h-32" />
                        </div>
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                            <MessageSquare className="w-7 h-7" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Chat Mode</h2>
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            <span className="font-semibold block mb-1">Iterative & Conversational:</span>
                            Talk to the AI to refine your test topic, specify learning objectives, and hand-pick questions through dialogue.
                        </p>
                        <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all">
                            Start Conversation <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>

                    {/* File Mode Card */}
                    <div
                        onClick={() => onNavigate('file')}
                        className="group bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <FileText className="w-32 h-32" />
                        </div>
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                            <FileText className="w-7 h-7" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">File Mode</h2>
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            <span className="font-semibold block mb-1">Structured & Fast:</span>
                            Upload a PDF, Word document, or text file. Our AI will analyze your material and generate a comprehensive test instantly.
                        </p>
                        <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all">
                            Upload Files <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Recent Activity Removed */}

                {/* Footer */}
                <div className="mt-16 text-center text-sm text-slate-400">
                    © 2024 StudBud Assessment Platform. Built for the future of learning.
                </div>
            </main>
        </div>
    );
}
